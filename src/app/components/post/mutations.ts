import { useToast } from "@/components/ui/use-toast"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import { deletePost } from "./actions"
import { PostPage } from "@/lib/type"

export function useDeletePostMutation() {

    const { toast } = useToast()
    const queryClient = useQueryClient()
    const router = useRouter()
    const pathname = usePathname()

    const mutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            const queryFilter: QueryFilters = { queryKey: ["post-feed"] }
            await queryClient.cancelQueries(queryFilter)
            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page) => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.filter((p) => p.id !== deletedPost.id),
                        })),
                    };
                },
            );
            toast({
                description: "Post deleted successfully"
            })
            if (pathname === `/posts/${deletedPost.id}`) {
                router.push(`/users/${deletedPost.user.username}`)
            }
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Post deleted successfully"
            })
        }
    })

    return mutation
}