"use client"
import kyInstance from "@/lib/ky"
import { NotificationCountInfo } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"
import { Button } from "../components/ui/button"
import Link from "next/link"
import { Bell } from "lucide-react"

interface NotificationButtonProps {
    initialState: NotificationCountInfo
}
export default function NotificationButton({ initialState }: NotificationButtonProps) {
    const { data } = useQuery({
        queryKey: ["unread-notification-count"],
        queryFn: () => kyInstance.get("/api/notifications/unread").json<NotificationCountInfo>(),
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
            <Link href={"/notifications"}>
                <div className="relative">
                    <Bell />
                    {!!data?.unreadCount && (
                        <span className="absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground px-1 text-xs font-medium tabular-nums">{data.unreadCount}</span>
                    )}
                </div>
                <span className="hidden lg:inline">Notifications</span>
            </Link>
        </Button>

    )
}
