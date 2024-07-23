import { PostData } from "@/lib/type"
import Link from "next/link"
import UserAvatar from "../ui/UserAvatar"
import { formateRelativeDate } from "@/lib/utils"
import PostMoreOption from "./PostMoreOption"
import { User } from "lucia"

interface IPostProps {
    post: PostData,
    user: User
}
export default function Post({ post, user }: IPostProps) {

    return (<article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex justify-between gap-3">
            <div className="flex flex-wrap gap-3">
                <Link href={`/users/${post.user.avatar}`}>
                    <UserAvatar avatarURL={post.user.avatar} />
                </Link>
                <div className="">
                    <Link href={`/users/${post.user.avatar}`}
                        className="block font-medium hover:underline"
                    >
                        {post.user.name ?? post.user.username}
                    </Link>
                    <Link href={`/posts./${post.id}`} className="block text-sm text-muted-foreground hover:underline">
                        {formateRelativeDate(post.createdAt)}
                    </Link>
                </div>
            </div>
            {post.user.id === user.id && <PostMoreOption post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100" />}
        </div>
        <div className="whitespace-pre-line break-words">
            {post.content}
        </div>
    </article>)
}
