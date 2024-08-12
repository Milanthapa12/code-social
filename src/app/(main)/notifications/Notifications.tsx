"use client"

import Post from '@/app/components/post/post'
import InfiniteScrollContainer from '@/app/components/ui/InfiniteScrollContainer'
import PostsLoadingSkeleton from '@/app/components/ui/PostLoadingSkeleton'
import kyInstance from '@/lib/ky'
import { INotificationPage } from '@/lib/type'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useSession } from '../SessionProvider'
import Notification from './Notification'

export default function Notifications() {

    const { user } = useSession()
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({ pageParam }) => kyInstance.get(
            "/api/notifications",
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<INotificationPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (firstPag) => firstPag.nextCursor
    })
    const notifications = data?.pages.flatMap(page => page.notifications) || []
    if (status === 'pending') {
        return <PostsLoadingSkeleton />
    }

    if (status === 'error') {
        return <p className='text-center text-destructive'>
            An Error occurred while loading notifications.
        </p>
    }

    if (status === "success" && notifications.length === 0 && !isFetching) return <p className='text-center text-muted-foreground'>No notification availble.</p>
    // console.log(posts, "ss")

    return (<><InfiniteScrollContainer className='space-y-5' onButtonReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {notifications.map((notification) => (<Notification key={notification.id} notification={notification} />))}
        {isFetchingNextPage && <Loader2 className='mx-auto my-3 animate-spin' />}
        {/* <button onClick={() => fetchNextPage()}>Load more</button> */}

    </InfiniteScrollContainer>
    </>)
}
