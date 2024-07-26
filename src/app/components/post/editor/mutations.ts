// import { useToast } from "@/app/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast"

import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "./action";
import { PostPage } from "@/lib/type";
import { useSession } from "@/app/(main)/SessionProvider";

export function useSubmitPostMutation() {

    const { user } = useSession()
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: async (newPost) => {
            const queryFilter = {
                queryKey: ["post-feed"],
                predicate(query: any) {
                    return query.queryKey.includes["for-you"] ||
                        query.queryKey.includes["user-posts"] && query.queryKey.includes(user.id)

                }
            } satisfies QueryFilters
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
                    return queryFilter.predicate(query) && !query.state.data
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