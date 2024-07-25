"use client"

import Post from '@/app/components/post/post'
import InfiniteScrollContainer from '@/app/components/ui/InfiniteScrollContainer'
import PostsLoadingSkeleton from '@/app/components/ui/PostLoadingSkeleton'
import kyInstance from '@/lib/ky'
import { PostPage } from '@/lib/type'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useSession } from './SessionProvider'

export default function FollowingFeed() {

    const { user } = useSession()
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["post-feed", "following"],
        queryFn: ({ pageParam }) => kyInstance.get(
            "/api/posts/following",
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<PostPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    const posts = data?.pages.flatMap(page => page.posts) || []
    if (status === 'pending') {
        return <PostsLoadingSkeleton />
    }

    if (status === 'error') {
        return <p className='text-center text-destructive'>
            An Error occurred while loading posts.
        </p>
    }

    if (status === "success" && posts.length === 0 && !isFetching) return <p className='text-center text-muted-foreground'>You have followed none.</p>
    return (<><InfiniteScrollContainer className='space-y-5' onButtonReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {posts.map((post) => (<Post key={post.id} post={post} user={user} />))}
        {isFetchingNextPage && <Loader2 className='mx-auto my-3 animate-spin' />}
    </InfiniteScrollContainer>
    </>)
}

