import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deleteComment, submitComment } from "./actions";
import { CommentData, ICommentPage } from "@/lib/type";

export function useSubmitCommentMutation(postId: string) {
    const { toast } = useToast()
    const queryClient = useQueryClient()


    const mutation = useMutation({
        mutationFn: submitComment,
        onSuccess: async (comment) => {
            const queryKey: QueryKey = ["comments", postId]
            await queryClient.cancelQueries({ queryKey })
            queryClient.setQueryData<InfiniteData<ICommentPage, string | null>>(
                queryKey,
                (oldData) => {
                    const firstPage = oldData?.pages[0]

                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    previousCursor: firstPage.previousCursor,
                                    comments: [...firstPage.comments, comment]
                                },
                                ...oldData.pages.slice(1)
                            ]
                        }
                    }
                }
            );
            queryClient.invalidateQueries({
                queryKey,
                predicate(query) {
                    return !query.state.data
                }
            });
            toast({
                description: "Comment created"
            })
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Failed to submit comment. try again later."
            })
        }
    })
    return mutation;
}

export function useDeleteCommentMutation(comment: CommentData) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: async (deletedComment) => {
            const queryKey: QueryKey = ["comments", deletedComment.id];
            await queryClient.cancelQueries({ queryKey })
            queryClient.setQueryData<InfiniteData<ICommentPage, string | null>>(
                queryKey,
                (oldData) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page) => ({
                            previousCursor: page.previousCursor,
                            comments: page.comments.filter(c => c.id !== deletedComment.id)
                        }))
                    }
                }
            );
            toast({
                description: "Comment deleted successfully."
            })
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Failed to delete comment. try again later."
            })
        }
    })
    return mutation
}