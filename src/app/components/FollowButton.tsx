"use client"
import useFollower from '@/hooks/useFollower'
import { IFollowerInfo } from '@/lib/type'
import React from 'react'
import { useToast } from "@/components/ui/use-toast"
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import kyInstance from '@/lib/ky'

interface IFollowButton {
    userId: string
    initialState: IFollowerInfo
}

export default function FollowButton({ userId, initialState }: IFollowButton) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const { data } = useFollower(userId, initialState)
    const queryKey: QueryKey = ["follower-info", userId]

    const { mutate } = useMutation({
        mutationFn: () => data.isFollowedByUser ? kyInstance.delete(`/api/users/${userId}/followers`)
            : kyInstance.post(`/api/users/${userId}/followers`),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey })
            const previousState = queryClient.getQueryData<IFollowerInfo>(queryKey);
            queryClient.setQueryData<IFollowerInfo>(queryKey, () => ({
                followers: (previousState?.followers || 0) + (previousState?.isFollowedByUser ? -1 : 1),
                isFollowedByUser: !previousState?.isFollowedByUser
            }))
            return { previousState }
        },
        onError(error, variable, context) {
            queryClient.setQueryData(queryKey, context?.previousState)
            console.error(error)
            toast({
                variant: "destructive",
                description: "Something went wrong, try again later"
            })
        }

    })

    return (<Button
        onClick={() => mutate()}
        variant={data.isFollowedByUser ? "secondary" : "default"}
    >{data.isFollowedByUser ? "Unfollow" : "Follow"}</Button>)

}
