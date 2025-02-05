import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { ILikeInfo } from "@/lib/type"
import { Prisma } from "@prisma/client"
import { User } from "lucide-react"

export async function GET(req: Request, {
    params: { postId }
}: { params: { postId: string } }) {
    try {
        const { user: loggedInUser } = await validateRequest()
        if (!loggedInUser) {
            return Response.json({
                error: "Unathorized"
            }, { status: 401 })
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                likes: {
                    where: {
                        userId: loggedInUser.id
                    }, select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            },
        })

        if (!post) {
            return Response.json({
                error: "Post not found"
            }, {
                status: 404
            })
        }
        const data: ILikeInfo = {
            likes: post._count.likes,
            isLikedByUser: !!post.likes.length
        }
        return Response.json(data)
    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Invalid server error"
        }, {
            status: 500
        })
    }
}

export async function POST(req: Request, {
    params: { postId }
}: { params: { postId: string } }) {

    try {
        const { user: loggedInUser } = await validateRequest()
        if (!loggedInUser) {
            return Response.json({
                error: "Unathorized"
            }, { status: 401 })
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                userId: true
            }
        })

        if (!post) {
            return Response.json({
                error: "Post not found."
            }, { status: 404 })
        }

        await prisma.$transaction([
            prisma.like.upsert({
                where: {
                    userId_postId: {
                        userId: loggedInUser.id,
                        postId
                    }
                },
                create: {
                    userId: loggedInUser.id,
                    postId
                },
                update: {}
            }),

            ...(loggedInUser.id !== post.userId ? [prisma.notification.create({
                data: {
                    issuerId: loggedInUser.id,
                    recipentId: post.userId,
                    postId,
                    type: "LIKE"
                }
            })] : [])
        ])

        return new Response()

    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Invalid server error"
        }, {
            status: 500
        })
    }
}

export async function DELETE(req: Request, {
    params: { postId }
}: { params: { postId: string } }) {
    try {
        const { user: loggedInUser } = await validateRequest()
        if (!loggedInUser) {
            return Response.json({
                error: "Unathorized"
            }, { status: 401 })
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                userId: true
            }
        })

        if (!post) {
            return Response.json({
                error: "Post not found."
            }, { status: 404 })
        }

        await prisma.$transaction([
            prisma.notification.deleteMany({
                where: {
                    issuerId: loggedInUser.id,
                    recipentId: post.userId,
                    postId,
                    type: "LIKE"
                }
            }),
            prisma.like.delete({
                where: {
                    userId_postId: {
                        userId: loggedInUser.id,
                        postId
                    }
                }
            }),

        ])

        return new Response()

    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Invalid server error"
        }, {
            status: 500
        })
    }
}