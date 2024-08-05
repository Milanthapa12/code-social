import { PostData } from "@/lib/type"
import Link from "next/link"
import UserAvatar from "../ui/UserAvatar"
import { cn, formateRelativeDate } from "@/lib/utils"
import PostMoreOption from "./PostMoreOption"
import { User } from "lucia"
import Linkify from "../Linkify"
import UserToolTip from "../user/UserToolTip"
import { Media } from "@prisma/client"
import Image from "next/image"
import LikeButton from "./LikeButton"
import BookmarkButton from "./BookmarkButton"

interface IPostProps {
    post: PostData,
    user: User
}
export default function Post({ post, user }: IPostProps) {

    return (<article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex justify-between gap-3">
            <div className="flex flex-wrap gap-3">
                <UserToolTip user={post.user}>
                    <Link href={`/users/${post.user.username}`}>
                        <UserAvatar avatarURL={post.user.avatar} />
                    </Link>
                </UserToolTip>
                <div className="">
                    <UserToolTip user={post.user}>
                        <Link href={`/users/${post.user.username}`}
                            className="block font-medium hover:underline"
                        >
                            {post.user.name ?? post.user.username}
                        </Link>
                    </UserToolTip>
                    <Link href={`/posts/${post.id}`} suppressHydrationWarning className="block text-sm text-muted-foreground hover:underline">
                        {formateRelativeDate(post.createdAt)}
                    </Link>
                </div>
            </div>
            {post.user.id === user.id && <PostMoreOption post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100" />}
        </div>
        <div className="whitespace-pre-line break-words">
            <Linkify>{post.content}</Linkify>
            {!!post.attachments.length && (<MediaPreviews attachments={post.attachments} />)}
            <hr className="text-muted-foreground my-3" />
            <div className="flex justify-between gap-5">
                <LikeButton
                    postId={post.id}
                    initialState={{
                        likes: post._count.likes,
                        isLikedByUser: post.likes.some((like) => like.userId === user.id)
                    }}
                />
                <BookmarkButton
                    postId={post.id}
                    initialState={{
                        isBookmarkedByUser: post.bookmarks.some(bookmark => bookmark.userId === user.id)
                    }}
                />
            </div>
        </div>
    </article>)
}

interface MediaPreviewsProps {
    attachments: Media[]
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
    return (<div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-3")}>
        {attachments.map((m) => (
            <MediaPreview key={m.id} media={m} />
        ))}
    </div>)
}

interface MediaPreviewProps {
    media: Media
}

function MediaPreview({ media }: MediaPreviewProps) {
    if (media.type === "IMAGE") {
        return (<Image src={media.url}
            alt="attachment"
            width={500}
            height={500}
            className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />)
    }
    if (media.type === "VIDEO") {
        return (<video controls className="size-fit max-h-[30rem] rounded-2xl">
            <source src={media.url} type={media.type} />
        </video>)
    }
    return <p className="text-destructive">Usupported media type provide.</p>
}