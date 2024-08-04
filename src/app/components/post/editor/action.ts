"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude } from "@/lib/type"
import { postValidation } from "@/lib/validation"

export async function createPost(input: {
    content: string;
    mediaIds: string[]
}) {

    const { user } = await validateRequest()
    if (!user) throw Error("Unathorized")

    const { content, mediaIds } = postValidation.parse(input)

    const newPost = await prisma.post.create({
        data: {
            content,
            userId: user.id,
            attachments: {
                connect: mediaIds.map((id: string) => ({ id }))
            }
        },
        include: getPostDataInclude(user.id)
    })

    return newPost;

}