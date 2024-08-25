import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import streamServerClient from "@/lib/stream"
import { MessageCountInfo, NotificationCountInfo } from "@/lib/type"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    const { user } = await validateRequest()
    if (!user) return Response.json({
        error: "Unathorized access"
    }, { status: 401 })
    try {

        const { total_unread_count } = await streamServerClient.getUnreadCount(user.id)

        const data: MessageCountInfo = {
            unreadCount: total_unread_count
        }

        return Response.json(data)


    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Internal server error"
        }, { status: 500 })
    }
}