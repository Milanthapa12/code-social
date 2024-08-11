import { CommentData, ICommentPage } from "@/lib/type"
import UserToolTip from "../user/UserToolTip"
import Link from "next/link"
import UserAvatar from "../ui/UserAvatar"
import { formateRelativeDate } from "@/lib/utils"
import MoreOption from "./MoreOption"
import { useSession } from "@/app/(main)/SessionProvider"

interface CommentProps {
    comment: CommentData
}
export default function Comment({ comment }: CommentProps) {
    const { user } = useSession()
    return (
        <div className="flex gap-3 py-3">
            <span className="hidden sm:inline">
                <UserToolTip user={comment.user}>
                    <Link href={`/users/${comment.user.username}`}>
                        <UserAvatar avatarURL={comment.user.avatar} size={40} />
                    </Link>
                </UserToolTip>
            </span>
            <div>
                <div className="flex items-center gap-1 text-sm">
                    <UserToolTip user={comment.user}>
                        <Link href={`/users/${comment.user.username}`} className="font-medium hover:underline">
                            {comment.user.name}
                        </Link>
                    </UserToolTip>
                    <span className="text-muted-foreground">{formateRelativeDate(comment.createdAt)}</span>
                </div>
                <div className="w-full flex justify-between">
                    <div>{comment.content}</div>
                    {comment.user.id === user.id && <MoreOption comment={comment} className="opacity-0 transition-opacity group-hover/post:opacity-100" />}
                </div>
            </div>
        </div>
    )
}
