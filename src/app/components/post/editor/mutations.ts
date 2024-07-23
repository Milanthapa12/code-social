// import { useToast } from "@/app/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast"

import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "./action";
import { PostPage } from "@/lib/type";

export function useSubmitPostMutation() {

    const { toast } = useToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: async (newPost) => {
            const queryFilter: QueryFilters = { queryKey: ["post-feed", 'for-you'] }
            await queryClient.cancelQueries(queryFilter)
            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
                queryFilter,
                (oldData) => {
                    const firstPage = oldData?.pages[0]
                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    posts: [newPost, ...firstPage.posts]
                                },
                                ...oldData.pages.slice(1)
                            ]
                        }
                    }
                }
            )
            // ONLY REQUIRED IF PAGE IS LOAIDING AND POST CREATED 
            queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate(query) {
                    return !query.state.data
                }
            })
            toast({
                description: "Post created"
            })
        },
        onError(error) {
            console.log(error)
            toast({
                variant: "destructive",
                description: "Failed to post. Please try again later"
            })
        }
    })
    return mutation;
}