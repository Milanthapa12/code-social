import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { INotificationPage, notificationInclude } from "@/lib/type"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    try {
        // await new Promise(r => setTimeout(r, 5000))
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined
        const pageSize = 10
        const { user } = await validateRequest()

        if (!user) return Response.json({
            error: "Unathorized access"
        }, { status: 401 })

        const notifications = await prisma.notification.findMany({
            where: {
                recipentId: user.id
            },
            include: notificationInclude,
            orderBy: { createdAt: "desc" },
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined
        })
        const nextCursor = notifications.length > pageSize ? notifications[pageSize].id : null
        const data: INotificationPage = {
            notifications: notifications.slice(0, pageSize),
            nextCursor
        }
        return Response.json(data)

    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Internal server error"
        }, { status: 500 })
    }
}