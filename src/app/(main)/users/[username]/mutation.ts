"use client"
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadingthing";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation'
import { updateUserProfile } from "./action";
import { UploadUserProfileValues } from "@/lib/validation";
import { PostPage } from "@/lib/type";

export function useUpdateProfileMutation() {
    const { toast } = useToast()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { startUpload: startAvatarUpload } = useUploadThing("avatar")

    const mutation = useMutation({
        mutationFn: async ({ values, avatar }: { values: UploadUserProfileValues, avatar?: File }) => {
            return Promise.all([
                updateUserProfile(values),
                avatar && startAvatarUpload([avatar])
            ])
        },
        onSuccess: async ([updatedUser, uploadResult]) => {
            const newAvatarURL = uploadResult?.[0].serverData.avatar
            const queryFilter: QueryFilters = {
                queryKey: ["post-feed"]
            }
            await queryClient.cancelQueries(queryFilter)
            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData?.pageParams,
                        pages: oldData?.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.map(post => {
                                if (post.user.id === updatedUser.id) {
                                    return {
                                        ...post,
                                        user: {
                                            ...updatedUser,
                                            avatar: newAvatarURL || updatedUser.avatar
                                        }
                                    }
                                }
                                return post
                            })
                        }))
                    }
                }

            )
            router.refresh()
            toast({
                description: "Profile updated successfully"
            })
        },
        onError(error) {
            console.error(error)
            toast({
                variant: "destructive",
                description: "Something went wrong, please try again later"
            })
        }
    })
    return mutation
}