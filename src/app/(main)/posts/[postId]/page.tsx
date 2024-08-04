import FollowButton from "@/app/components/FollowButton"
import Linkify from "@/app/components/Linkify"
import Post from "@/app/components/post/post"
import UserAvatar from "@/app/components/ui/UserAvatar"
import UserToolTip from "@/app/components/user/UserToolTip"
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude, UserData } from "@/lib/type"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"

interface IPageProps {
    params: { postId: string }
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: getPostDataInclude(loggedInUserId)
    })
    if (!post) return notFound()
    return post
})

export async function generateMetadata({ params: { postId } }: IPageProps) {
    const { user } = await validateRequest()
    if (!user) return {}
    const post = await getPost(postId, user.id)
    return { title: `${post.user.name}: ${post.content.slice(0, 50)}...` }
}

export default async function Page({ params: { postId } }: IPageProps) {
    const { user } = await validateRequest()
    if (!user) return (<p className="text-destructive">You&apos;re not authorized to view this page.</p>)

    const post = await getPost(postId, user.id)
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 spacey-5">
                <Post post={post} user={user} />
            </div>
            <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
                <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
                    <UsereInfoSideBar user={post.user} />
                </Suspense>
            </div>
        </main>
    )
}

interface UsereInfoSideBarProps {
    user: UserData
}

async function UsereInfoSideBar({ user }: UsereInfoSideBarProps) {
    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser) return null

    return (<div className="space-y-5 roundex-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">About user</div>
        <UserToolTip user={user}>
            <Link href={`/users/${user.username}`} className="flex items-center gap-3">
                <UserAvatar avatarURL={user.avatar} className="flex-none" />
                <div>
                    <p className="line-clamp-1 break-all font-semibold hover:underline">{user.name}</p>
                    <p className="line-clamp-1 break-all text-muted-foreground">@{user.username}</p>
                </div>
            </Link>
        </UserToolTip>
        <Linkify>
            <div className="line-clamp-1 whitespace-pre-line break-all text-muted-foreground">{user.bio}</div>
        </Linkify>
        {user.id !== loggedInUser.id && (
            <FollowButton
                userId={user.id}
                initialState={{
                    followers: user._count.followers,
                    isFollowedByUser: user.followers.some(({ followerId }) => followerId === loggedInUser.id)
                }}
            />
        )}
    </div>)
}