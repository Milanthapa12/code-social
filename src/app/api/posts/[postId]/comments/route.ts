import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, ICommentPage } from "@/lib/type";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params: { postId } }: { params: { postId: string } }) {

    try {
        // await new Promise(r => setTimeout(r, 5000))
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined
        const pageSize = 5
        const { user } = await validateRequest()
        if (!user) return Response.json({
            error: "Unathorized access"
        }, { status: 401 })

        const comments = await prisma.comment.findMany({
            where: { postId },
            include: getCommentDataInclude(user.id),
            orderBy: { createdAt: "asc" },
            take: -pageSize - 1,
            cursor: cursor ? { id: cursor } : undefined
        })
        const previousCursor = comments.length > pageSize ? comments[0].id : null
        const data: ICommentPage = {
            comments: comments.length > pageSize ? comments.slice(1) : comments,
            previousCursor
        }
        return Response.json(data)
    } catch (error) {
        console.error(error)
        return Response.json({
            error: "Internal server error"
        }, { status: 500 })
    }
}