"use server"

import prisma from "@/lib/prisma";
import { loginRequestValidation, LoginValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2"
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(credential: LoginValues): Promise<{ error: string }> {

    try {
        const { username, password } = loginRequestValidation.parse(credential)
        const userExist = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username
                }
            }
        })
        if (!userExist) {
            return {
                error: "Invalid credential provided"
            }
        }

        const matchedPassowrd = await verify(userExist.password as string, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })

        if (!matchedPassowrd) {
            return {
                error: "Invalid credential provided"
            }
        }

        const session = await lucia.createSession(userExist.id.toString(), {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

        return redirect("/")

    } catch (error) {
        console.error(error, "from login")
        if (isRedirectError(error)) throw error
        return {
            error: "Something went wrong. Please try again"
        }
    }

}