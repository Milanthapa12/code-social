"use client"
import Post from '@/app/components/post/post'
import InfiniteScrollContainer from '@/app/components/ui/InfiniteScrollContainer'
import PostsLoadingSkeleton from '@/app/components/ui/PostLoadingSkeleton'
import kyInstance from '@/lib/ky'
import { PostPage } from '@/lib/type'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useSession } from '../SessionProvider'
import page from './page'

interface SearchResultsProps {
    query: string
}

export default function SearchResult({ query }: SearchResultsProps) {

    const { user } = useSession()
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["post-feed", "search", query],
        queryFn: ({ pageParam }) => kyInstance.get(
            "/api/search",
            { searchParams: { q: query, ...(pageParam ? { cursor: pageParam } : {}) } }
        ).json<PostPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        gcTime: 0,
    })
    const posts = data?.pages.flatMap(page => page.posts) || []
    if (status === 'pending') {
        return <PostsLoadingSkeleton />
    }

    if (status === 'error') {
        return <p className='text-center text-destructive'>
            An Error occurred while loading search.
        </p>
    }

    if (status === "success" && posts.length === 0 && !isFetching) return <p className='text-center text-muted-foreground'>No search result found.</p>
    // console.log(posts, "ss")

    return (<><InfiniteScrollContainer className='space-y-5' onButtonReached={() => hasNextPage && !isFetching && fetchNextPage()}>
        {posts.map((post) => (<Post key={post.id} post={post} user={user} />))}
        {isFetchingNextPage && <Loader2 className='mx-auto my-3 animate-spin' />}
        {/* <button onClick={() => fetchNextPage()}>Load more</button> */}

    </InfiniteScrollContainer>
    </>)
}
