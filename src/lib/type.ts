import { Prisma } from "@prisma/client";

export const userData = {
    id: true,
    name: true,
    username: true,
    avatar: true

} satisfies Prisma.UserSelect

export const postDataInclude = {
    user: { select: userData }

} satisfies Prisma.PostInclude

export type PostData = Prisma.PostGetPayload<{
    include: typeof postDataInclude
}>

export interface PostPage {
    posts: PostData[],
    nextCursor: string | null
}