"use client"

import { ICommentPage, PostData } from "@/lib/type"
import CommentInput from "./CommentInput"
import { useInfiniteQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"
import Comment from "./Comment"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"

interface ICommentProps {
    post: PostData
}

export default function Comments({ post }: ICommentProps) {

    const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
        queryKey: ["comments", post.id],
        queryFn: ({ pageParam }) => kyInstance.get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<ICommentPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (firstPage) => firstPage.previousCursor,
        select: (data) => ({
            pages: [...data.pages].reverse(),
            pageParams: [...data.pageParams].reverse()
        })
    })

    const comments = data?.pages.flatMap((page) => page.comments) || []
    return (
        <div>
            <CommentInput post={post} />
            {hasNextPage && (<Button variant={'link'} className="mx-auto block" disabled={isFetching} onClick={() => fetchNextPage()}>
                Load previous comments
            </Button>)}
            {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
            {status === "success" && !comments.length && (<p className="text-muted-foreground text-center">No comment.</p>)}
            {status === "error" && (<p className="text-destructive text-center">An error occurredd while loading comments</p>)}
            <div className="divide-y">
                {
                    comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} />
                    ))
                }
            </div>
        </div>
    )
}