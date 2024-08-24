"use client"

import { ChannelList, ChannelPreviewMessenger, ChannelPreviewUIComponentProps } from "stream-chat-react"
import { useSession } from "../SessionProvider"
import { Button } from "@/app/components/ui/button"
import { MailPlus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCallback, useState } from "react"
import NewChatDialog from "./NewChatDialog"

interface ChatSideBarProps {
    open: boolean,
    onClose: () => void
}

function ChatSideBar({ open, onClose }: ChatSideBarProps) {

    const { user } = useSession()

    const ChannelPreviewCustom = useCallback((props: ChannelPreviewUIComponentProps) => (
        <ChannelPreviewMessenger {...props} onSelect={() => {
            props.setActiveChannel?.(props.channel, props.watchers)
            onClose()
        }} />
    ), [onClose])

    return (
        <div className={cn("size-full md:flex flex-col border-e md:w-72", open ? "flex" : "hidden")}>
            <MenuHeader onClose={onClose} />
            <ChannelList filters={{
                type: "messaging",
                members: { $in: [user.id] },
            }}
                showChannelSearch
                options={{ state: true, presence: true, limit: 8 }}
                sort={{ last_message_at: -1 }}
                additionalChannelSearchProps={{
                    searchForChannels: true,
                    searchQueryParams: {
                        channelFilters: {
                            filters: { members: { $in: [user.id] } }
                        }
                    }
                }}
                Preview={ChannelPreviewCustom}
            />
        </div>
    )
}

export default ChatSideBar

interface MenuHeaderProps {
    onClose: () => void
}

function MenuHeader({ onClose }: MenuHeaderProps) {
    const [showNewChatDialog, setShowNewChatDialog] = useState(false)
    return (<><div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
            <Button size={'icon'} variant={'ghost'} onClick={onClose}>
                <X className="size-5" />
            </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button size={"icon"} variant={"ghost"} title="Start new chat" onClick={() => setShowNewChatDialog(true)}>
            <MailPlus className="size-5" />
        </Button>
    </div>
        {showNewChatDialog && (<NewChatDialog
            onChatCreated={() => {
                setShowNewChatDialog(false)
                onClose()
            }}
            onOpenChange={setShowNewChatDialog}
        />)}
    </>)
}