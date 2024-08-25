"use client"
import kyInstance from "@/lib/ky"
import { NotificationCountInfo } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"
import { Button } from "../components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

interface MessageButtonProps {
    initialState: NotificationCountInfo
}
export default function MessageButton({ initialState }: MessageButtonProps) {
    const { data } = useQuery({
        queryKey: ["unread-messages-count"],
        queryFn: () => kyInstance.get("/api/messages/unread").json<NotificationCountInfo>(),
        initialData: initialState,
        refetchInterval: 60 * 1000
    })
    return (
        <Button
            variant="ghost"
            className="flex item-center justify-start gap-3"
            title="Notifications"
            asChild
        >
            <Link href={"/messages"}>
                <div className="relative">
                    <Mail />
                    {!!data?.unreadCount && (
                        <span className="absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground px-1 text-xs font-medium tabular-nums">{data.unreadCount}</span>
                    )}
                </div>
                <span className="hidden lg:inline">Messages</span>
            </Link>
        </Button>

    )
}
