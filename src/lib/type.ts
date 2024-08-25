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
        user: { select: getUserDataSelect(loggedInUserId) },
        attachments: true,
        likes: {
            where: {
                userId: loggedInUserId
            },
            select: {
                userId: true
            }
        },
        bookmarks: {
            where: {
                userId: loggedInUserId
            }, select: {
                userId: true
            }
        },
        _count: {
            select: {
                likes: true,
                comments: true
            }
        }
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

export function getCommentDataInclude(loggedInUserId: string) {
    return {
        user: {
            select: getUserDataSelect(loggedInUserId)
        }
    } satisfies Prisma.CommentInclude
}

export type CommentData = Prisma.CommentGetPayload<{
    include: ReturnType<typeof getCommentDataInclude>;
}>

export interface ICommentPage {
    comments: CommentData[],
    previousCursor: string | null
}

export const notificationInclude = {
    issuer: {
        select: {
            username: true,
            name: true,
            avatar: true
        }
    },
    post: {
        select: {
            content: true
        }
    }
} satisfies Prisma.NotificationInclude

export type Notification = Prisma.NotificationGetPayload<{
    include: typeof notificationInclude
}>

export interface INotificationPage {
    notifications: Notification[],
    nextCursor: string | null
}

export interface IFollowerInfo {
    followers: number
    isFollowedByUser: boolean
}

export interface ILikeInfo {
    likes: number,
    isLikedByUser: boolean
}

export interface IBookmark {
    isBookmarkedByUser: boolean
}

export interface NotificationCountInfo {
    unreadCount: number;
}

export interface MessageCountInfo {
    unreadCount: number;
}
