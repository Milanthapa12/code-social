"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude } from "@/lib/type"
import { postValidation } from "@/lib/validation"

export async function createPost(input: string) {

    const { user } = await validateRequest()
    if (!user) throw Error("Unathorized")

    const { content } = postValidation.parse({ content: input })

    const newPost = await prisma.post.create({
        data: {
            content,
            userId: user.id
        },
        include: getPostDataInclude(user.id)
    })

    return newPost;

}