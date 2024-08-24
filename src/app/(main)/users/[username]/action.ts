"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/type";
import { updateUserProfileSchema, UploadUserProfileValues } from "@/lib/validation";

export async function updateUserProfile(values: UploadUserProfileValues) {

    const validateValues = updateUserProfileSchema.parse(values)
    const { user } = await validateRequest()

    if (!user) throw new Error("Unathorized")
    const updatedUser = await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
            where: { id: user.id },
            data: validateValues,
            select: getUserDataSelect(user.id)
        });
        await streamServerClient.partialUpdateUser({
            id: user.id,
            set: {
                name: validateValues.name
            }
        });
        return updatedUser
    })
    // const updatedUser = await prisma.user.update({
    //     where: { id: user.id },
    //     data: validateValues,
    //     select: getUserDataSelect(user.id)
    // })

    return updatedUser
}