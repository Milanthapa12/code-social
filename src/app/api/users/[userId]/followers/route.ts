import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { IFollowerInfo } from "@/lib/type"

// GET ALL FOLLOWERS
export async function GET(req: Request, {
    params: { userId } }: {
        params: { userId: string }
    }) {
    try {
        const { user: loggedInUser } = await validateRequest()
        if (!loggedInUser) {
            return Response.json({ error: "Unathorized Access" }, { status: 401 })
        }
        const user = await prisma.user.findUnique({
            where: {
                id: loggedInUser.id
            },
            select: {
                followers: {
                    where: {
                        followerId: loggedInUser.id
                    }
                },
                _count: {
                    select: {
                        followers: true
                    }
                }
            }
        })

        if (!user) {
            return Response.json({ error: "Not found." }, { status: 404 })
        }
        const data: IFollowerInfo = {
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.length
        }
        return Response.json(data)

    } catch (error) {
        console.error(error, "from following api")
        return Response.json({ error: "Something went wrong, please try again later" }, { status: 500 })
    }
}

// FOLLOW USER
export async function POST(req: Request, { params: { userId } }: { params: { userId: string } }) {
    try {

        const { user: loggedInUser } = await validateRequest()
        if (!loggedInUser) {
            return Response.json({ error: "Unathorized Access" }, { status: 403 })
        }

        //upsert- ignore if already exist
        await prisma.follow.upsert({
            where: {
                followerId_followingId: {
                    followerId: loggedInUser.id,
                    followingId: userId
                }
            },
            update: {},
            create: {
                followerId: loggedInUser.id,
                followingId: userId
            }
        })
        return new Response()

    } catch (error) {
        console.error(error, "from following api")
        return Response.json({ error: "Something went wrong, please try again later" }, { status: 500 })
    }
}

// REMOVE USER 
export async function DELETE(req: Request, {
    params: { userId } }: {
        params: { userId: string }
    }) {
    try {
        const { user: loggedInUser } = await validateRequest()
        if (!loggedInUser) {
            return Response.json({ error: "Unathorized Access" }, { status: 401 })
        }
        await prisma.follow.deleteMany({
            where: {
                followerId: loggedInUser.id,
                followingId: userId
            }
        })
        return new Response()
    } catch (error) {
        console.error(error, "from following api")
        return Response.json({ error: "Something went wrong, please try again later" }, { status: 500 })
    }
}