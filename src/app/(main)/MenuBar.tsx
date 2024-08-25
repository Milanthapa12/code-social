import { Button } from "@/app/components/ui/button"
import { Bell, Home, Mail } from "lucide-react"
import Link from "next/link"
import NotificationButton from "./NotificationButton"
import MessageButton from "./MessageButton"

interface IMenuBarProps {
    className?: string
}
export default function MenuBar({ className }: IMenuBarProps) {
    return (<div className={className}>
        <Button
            variant="ghost"
            className="flex item-center justify-start gap-3"
            title="Home"
            asChild
        >
            <Link href={"/"}>
                <Home />
                <span className="hidden lg:inline">Home</span>
            </Link>
        </Button>
        <NotificationButton initialState={{ unreadCount: 0 }} />

        {/* <Button
            variant="ghost"
            className="flex item-center justify-start gap-3"
            title="Notifications"
            asChild
        >
            <Link href={"/notifications"}>
                <Bell />
                <span className="hidden lg:inline">Notifications</span>
            </Link>
        </Button> */}

        {/* <Button
            variant="ghost"
            className="flex item-center justify-start gap-3"
            title="Messages"
            asChild
        >
            <Link href={"/messages"}>
                <Mail />
                <span className="hidden lg:inline">Messages</span>
            </Link>
        </Button> */}
        <MessageButton initialState={{ unreadCount: 0 }} />
        <Button
            variant="ghost"
            className="flex item-center justify-start gap-3"
            title="Bookmarks"
            asChild
        >
            <Link href={"/bookmarks"}>
                <Mail />
                <span className="hidden lg:inline">Bookmarks</span>
            </Link>
        </Button>


    </div>
    )
}
