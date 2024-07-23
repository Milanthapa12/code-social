"use server"

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { registerRequestValidation, RegisterValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2"
import { User } from "@prisma/client";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function register(credential: RegisterValues): Promise<{ error: string }> {
    try {
        const { username, email, password } = registerRequestValidation.parse(credential)
        const hashedPassword = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })
        const userId = generateIdFromEntropySize(10)
        const isUniqueUsername = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username
                }
            }
        })
        if (isUniqueUsername) {
            return {
                error: "Username already taken"
            }
        }
        const isUniqueEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    // mode: "insensitive"
                }
            }
        })
        if (isUniqueEmail) {
            return {
                error: "Email already taken"
            }
        }
        await prisma.user.create({
            data: {
                id: userId,
                username,
                email,
                password: hashedPassword
            }
        })
        const luciaSession = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(luciaSession.id)
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

        return redirect("/")

    } catch (error) {
        console.error(error, "register")
        if (isRedirectError(error)) throw error
        return {
            error: "Something went wrong. Please try again"
        }
    }
}