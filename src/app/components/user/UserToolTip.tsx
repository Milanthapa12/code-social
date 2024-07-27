"use client"

import { useSession } from "@/app/(main)/SessionProvider"
import { IFollowerInfo, UserData } from "@/lib/type"
import { PropsWithChildren } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import Link from "next/link"
import UserAvatar from "../ui/UserAvatar"
import FollowButton from "../FollowButton"
import Linkify from "../Linkify"
import FollowerCount from "../ui/FollowerCount"

interface IUserTooltipProps extends PropsWithChildren {
    user: UserData
}

export default function UserToolTip({ children, user }: IUserTooltipProps) {

    const { user: loggedInUser } = useSession()
    const followerState: IFollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: user.followers.some(({ followerId }) => followerId === loggedInUser.id)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>
                    <div className="flex mx-w-80 flex-col gap-3 break-words px-1 py-2 5 md:min-w-52">
                        <div className="flex justify-between gap-2">
                            <Link href={`/users/${user.username}`}>
                                <UserAvatar size={70} avatarURL={user.avatar} />
                            </Link>
                            {loggedInUser.id !== user.id && (<FollowButton userId={user.id} initialState={followerState} />)}
                        </div>
                        <div>
                            <Link href={`/users/${user.username}`}>
                                <div className="text-lg font-semibold hover:underline">
                                    {user.name}
                                </div>
                                <div className="text-muted-forground">@{user.username}</div>
                            </Link>
                        </div>
                        {
                            user.bio && (<Linkify>
                                <div className="line-clamp-4 whitespace-pre-line">
                                    {user.bio}
                                </div>
                            </Linkify>)
                        }
                        <FollowerCount userId={user.id} initialState={followerState} />
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
