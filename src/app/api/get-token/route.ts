import { validateRequest } from "@/auth"
import streamServerClient from "@/lib/stream"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {

    const { user } = await validateRequest()
    if (!user) return Response.json({
        error: "Unathorized access"
    }, { status: 401 })
    try {

        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60
        const issuedAt = Math.floor(Date.now() / 1000) - 60;
        const token = streamServerClient.createToken(
            user.id,
            expirationTime,
            issuedAt
        )

        return Response.json({ token })

    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Internal server error"
        }, { status: 500 })
    }
}