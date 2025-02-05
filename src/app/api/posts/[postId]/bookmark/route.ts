import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { IBookmark, ILikeInfo } from "@/lib/type"

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

        const bookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId: loggedInUser.id,
                    postId
                }
            }
        })
        const data: IBookmark = {
            isBookmarkedByUser: !!bookmark
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

        await prisma.bookmark.upsert({
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
        })

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

        await prisma.bookmark.delete({
            where: {
                userId_postId: {
                    userId: loggedInUser.id,
                    postId
                }
            }
        })

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