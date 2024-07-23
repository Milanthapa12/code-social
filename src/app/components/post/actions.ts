"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/type"

export async function deletePost(id: string) {

    const { user } = await validateRequest()
    if (!user) throw new Error("Unathorized")

    const foundPost = await prisma.post.findUnique({
        where: {
            id: id
        },
        include: {
            user: true
        }
    })

    if (!foundPost) throw new Error("Post not found !")
    if (foundPost.user.id !== user.id) throw new Error("Unathorized")
    const deletedPost = await prisma.post.delete({
        where: {
            id: foundPost.id
        },
        include: postDataInclude
    })

    return deletedPost






}