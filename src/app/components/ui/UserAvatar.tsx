import { cn } from "@/lib/utils"
import Image from "next/image"

interface IUserAvatarProps {
    avatarURL: string | null | undefined
    size?: number
    className?: string
}
export default function UserAvatar({ avatarURL, size, className }: IUserAvatarProps) {
    return (<Image
        src={`${avatarURL ? avatarURL : '/assets/avatar-placeholder.png'}`}
        alt={'avatar'}
        width={size ?? 50}
        height={size ?? 50}
        className={cn("aspect-square h-fit flex-none rounded-full bg-secondary object-cover", className)}

    />
    )
}
