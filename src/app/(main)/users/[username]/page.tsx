import FollowButton from "@/app/components/FollowButton"
import { Button } from "@/app/components/ui/button"
import FollowerCount from "@/app/components/ui/FollowerCount"
import TrendingBlock from "@/app/components/ui/TrendingBlock"
import UserAvatar from "@/app/components/ui/UserAvatar"
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getUserDataSelect, IFollowerInfo, UserData } from "@/lib/type"
import { formatDate } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { userInfo } from "os"
import { cache } from "react"
import UserPost from "./UserPost"
import Linkify from "@/app/components/Linkify"
import EditProfile from "./EditProfile"

interface IPageProps {
    params: { username: string }
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                // mode: "insensitive"
            }
        },
        select: getUserDataSelect(loggedInUserId)
    })

    if (!user) notFound()
    return user
})

export async function generateMetadata({ params: { username } }: IPageProps): Promise<Metadata> {
    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser) return {}
    const user = await getUser(username, loggedInUser.id)

    return ({
        title: `${user.name ?? ''} (@${user.username})`,
    })

}

export default async function Page({ params: { username } }: IPageProps) {
    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser) {
        return <p className="text-destructive">You are not authorized view this page.</p>
    }

    const user = await getUser(username, loggedInUser.id)
    return (
        <div className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y5">
                <UserProfile user={user} loggedInUserId={loggedInUser.id} />
            </div>
            <TrendingBlock />
        </div>
    )
}

interface IUserProfileProps {
    user: UserData,
    loggedInUserId: string
}

async function UserProfile({ user, loggedInUserId }: IUserProfileProps) {

    const followerInfo: IFollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: user.followers.some(({ followerId }) => followerId === loggedInUserId)
    }

    return (<><div className="h-fit w-full space-y-5 container-border-radius bg-card p-5 shadow-sm mb-5">
        <UserAvatar
            avatarURL={user.avatar}
            size={250}
            className="mx-auto size-full max-h-60 max-w-60 rounded-full"
        />
        <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <div className="me-auto space-y-3">
                <div>
                    <h1 className="text-3xl fond-bold">
                        {user.name ?? user.username}
                    </h1>
                    <div className="text-muted-foreground">@{user.username}</div>
                </div>
                <div>Member since {formatDate(user.createdAt, "MMMM d, yyyy")}</div>
                <div className="flex items-center gap-3">
                    <span>
                        Post: {" "}
                        <span className="font-semibold">{user._count.posts}</span>
                    </span>
                    <FollowerCount userId={user.id} initialState={followerInfo} />
                </div>
            </div>
            {user.id === loggedInUserId ? (
                <EditProfile user={user} />
            ) : (<FollowButton userId={user.id} initialState={followerInfo} />)}
        </div>
        {user.bio && (<>
            <hr />
            <Linkify>
                <div className="whitespace-pre-line overflow-hidden break-words">
                    {user.bio}
                </div>
            </Linkify>
        </>)}
    </div>
        <UserPost userId={user.id} />
    </>)
}
