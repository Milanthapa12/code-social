import { ILikeInfo } from '@/lib/type'
import React from 'react'
import { useToast } from '../ui/use-toast'
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import kyInstance from '@/lib/ky'
import { HeartIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
    postId: string,
    inititalState: ILikeInfo
}

export default function LikeButton({ postId, inititalState }: LikeButtonProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const queryKey: QueryKey = ["like-info", postId]
    const { data } = useQuery({
        queryKey,
        queryFn: () => kyInstance.get(`/api/posts/${postId}/likes`).json<ILikeInfo>(),
        initialData: inititalState,
        staleTime: Infinity
    })

    const { mutate } = useMutation({
        mutationFn: () => data.isLikedByUser
            ? kyInstance.delete(`/api/posts/${postId}/likes`)
            : kyInstance.post(`/api/posts/${postId}/likes`),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey })
            const prevState = queryClient.getQueryData<ILikeInfo>(queryKey)
            queryClient.setQueryData<ILikeInfo>(queryKey, () => ({
                likes: (prevState?.likes || 0) + (prevState?.isLikedByUser ? -1 : 1),
                isLikedByUser: !prevState?.isLikedByUser
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
            <HeartIcon className={cn("size-5", data.isLikedByUser && "fill-red-500 text-red-500")} />
            <span className="text-sm font-medium tabular-nums">{data.likes} <span className='hidden sm:inline'>likes</span></span>
        </button>
    )
}
