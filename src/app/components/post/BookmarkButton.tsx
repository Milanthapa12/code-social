import { IBookmark } from '@/lib/type'
import React from 'react'
import { useToast } from '../ui/use-toast'
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import kyInstance from '@/lib/ky'
import { Bookmark, HeartIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
    postId: string,
    initialState: IBookmark
}

export default function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {

    const { toast } = useToast()
    const queryClient = useQueryClient()
    const queryKey: QueryKey = ["bookmark-info", postId]
    const { data } = useQuery({
        queryKey,
        queryFn: () => kyInstance.get(`/api/posts/${postId}/bookmark`).json<IBookmark>(),
        initialData: initialState,
        staleTime: Infinity
    })

    const { mutate } = useMutation({
        mutationFn: () => data.isBookmarkedByUser
            ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
            : kyInstance.post(`/api/posts/${postId}/bookmark`),
        onMutate: async () => {
            toast({
                description: `Post ${data.isBookmarkedByUser ? "Un" : ""}bookmarked`
            })
            await queryClient.cancelQueries({ queryKey })
            const prevState = queryClient.getQueryData<IBookmark>(queryKey)
            queryClient.setQueryData<IBookmark>(queryKey, () => ({
                isBookmarkedByUser: !prevState?.isBookmarkedByUser
            }))
            return { prevState }
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.prevState)
            console.error(error)
            toast({
                variant: "destructive",
                description: "Something went wrong. please try again"
            })
        }
    })

    return (
        <button onClick={() => mutate()} className='flex items-center gap-2'>
            <Bookmark className={cn("size-5", data?.isBookmarkedByUser && "fill-primary")} />
        </button>
    )
}
