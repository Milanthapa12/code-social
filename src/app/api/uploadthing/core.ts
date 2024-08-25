import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import streamServerClient from "@/lib/stream"
import { createUploadthing, FileRouter } from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server"
const f = createUploadthing()
const filePath = `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`;
export const fileRouter = {

    avatar: f({
        image: { maxFileSize: "512KB" }
    }).middleware(async () => {
        const { user } = await validateRequest()
        if (!user) throw new UploadThingError("Unathorized")
        return { user }
    }).onUploadComplete(async ({ metadata, file }) => {
        const oldAvatarURL = metadata.user.avatarUrl;
        // deleting old avatar
        if (oldAvatarURL) {
            const key = oldAvatarURL.split(filePath)[1]
            await new UTApi().deleteFiles(key)

        }
        const newAvatarURL = file.url.replace("/f/", filePath)
        await Promise.all([
            prisma.user.update({
                where: {
                    id: metadata.user.id
                },
                data: {
                    avatar: newAvatarURL
                }
            }),
            streamServerClient.partialUpdateUser({
                id: metadata.user.id,
                set: {
                    image: newAvatarURL
                }
            })

        ])
        // await prisma.user.update({
        //     where: {
        //         id: metadata.user.id
        //     },
        //     data: {
        //         avatar: newAvatarURL
        //     }
        // })
        return { avatar: newAvatarURL }
    }),
    attachment: f({
        image: { maxFileSize: "4MB", maxFileCount: 5 },
        video: { maxFileSize: "64MB", maxFileCount: 5 }
    }).middleware(async () => {
        const { user } = await validateRequest()
        if (!user) throw new UploadThingError("Unathorized")
        return {}
    }).onUploadComplete(async ({ file }) => {
        const media = await prisma.media.create({
            data: {
                url: file.url.replace(
                    "/f/",
                    filePath
                ),
                type: file.type.startsWith("image") ? "IMAGE" : "VIDEO"
            }
        })
        return { mediaId: media.id }
    })
} satisfies FileRouter

export type AppFileRoute = typeof fileRouter