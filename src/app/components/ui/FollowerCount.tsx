"use client"

import useFollower from "@/hooks/useFollower"
import { IFollowerInfo } from "@/lib/type"

interface IFollowerCount {
    userId: string,
    initialState: IFollowerInfo
}
export default function FollowerCount({ userId, initialState }: IFollowerCount) {
    const { data } = useFollower(userId, initialState)
    return (<span>
        Followers: {" "}
        <span className="font-semibold">{data.followers}</span>
    </span>)
}
