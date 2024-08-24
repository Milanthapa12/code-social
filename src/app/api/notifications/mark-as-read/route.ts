import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { NotificationCountInfo } from "@/lib/type"
import { NextRequest } from "next/server"

export async function PATCH() {

    const { user } = await validateRequest()
    if (!user) return Response.json({
        error: "Unathorized access"
    }, { status: 401 })
    try {

        const unreadCount = await prisma.notification.updateMany({
            where: {
                recipentId: user.id,
                read: false
            },
            data: {
                read: true
            }
        })
        return new Response()
    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Internal server error"
        }, { status: 500 })
    }
}