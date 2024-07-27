import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request, {
    params: { username } }: {
        params: { username: string }
    }) {
    try {
        const { user: loggedInUser } = await validateRequest()
        if (!loggedInUser) {
            return Response.json({ error: "Unathorized Access" }, { status: 401 })
        }
        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    // mode: "insensitive"
                }
            }
        })
        if (!user) {
            return Response.json({
                error: "User not found"
            }, { status: 404 })
        }
        return Response.json(user)
    } catch (error) {
        console.error(error, "from following api")
        return Response.json({ error: "Something went wrong, please try again later" }, { status: 500 })
    }
}