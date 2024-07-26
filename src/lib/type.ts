import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
    return {
        id: true,
        name: true,
        username: true,
        bio: true,
        createdAt: true,
        avatar: true,
        followers: {
            where: {
                followerId: loggedInUserId
            }
        },
        _count: {
            select: {
                posts: true,
                followers: true
            }
        }
    } satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{
    select: ReturnType<typeof getUserDataSelect>
}>;

export function getPostDataInclude(loggedInUserId: string) {
    return {
        user: { select: getUserDataSelect(loggedInUserId) }
    } satisfies Prisma.PostInclude
}

export type PostData = Prisma.PostGetPayload<{
    include: ReturnType<typeof getPostDataInclude>
}>

// export const userData = {
//     id: true,
//     name: true,
//     username: true,
//     avatar: true

// } satisfies Prisma.UserSelect

// export const postDataInclude = {
//     user: { select: userData }

// } satisfies Prisma.PostInclude

// export type PostData = Prisma.PostGetPayload<{
//     include: typeof postDataInclude
// }>

export interface PostPage {
    posts: PostData[],
    nextCursor: string | null
}

export interface IFollowerInfo {
    followers: number
    isFollowedByUser: boolean
}

