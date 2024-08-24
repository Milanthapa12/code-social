import { Button } from '@/app/components/ui/button'
import { Dialog, DialogHeader } from '@/app/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react'
import { useSession } from '../SessionProvider'
import useDebounce from '@/hooks/useDebounce'
import { UserResponse } from 'stream-chat'
import { useQuery } from '@tanstack/react-query'
import { Check, SearchIcon, X } from 'lucide-react'
import UserAvatar from '@/app/components/ui/UserAvatar'

interface NewChatDialogProps {
    onOpenChange: (open: boolean) => void,
    onChatCreated: () => void
}

export default function NewChatDialog({ onOpenChange, onChatCreated }: NewChatDialogProps) {
    const { client, setActiveChannel } = useChatContext()
    const { toast } = useToast()
    const { user: loggedinUser } = useSession()
    const [searchInput, setSearchInput] = useState("")
    const searchInputDebounced = useDebounce(searchInput)
    const [selectedUsers, setSelectedUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>([])

    const { data, isFetching, isError, isSuccess } = useQuery({
        queryKey: ["stream-users", searchInputDebounced],
        queryFn: async () => client.queryUsers({
            id: { $ne: loggedinUser.id },
            role: { $ne: "admin" },
            ...(searchInputDebounced ? {
                $or: [
                    { name: { $autocomplete: searchInputDebounced } },
                    { username: { $autocomplete: searchInputDebounced } }
                ]
            } : {})
        },
            { name: 1, username: 1 }, { limit: 15 })
    })

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className='bg-card p-0'>
                <DialogHeader className='px-6 pt-6'>
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="group relative">
                        <SearchIcon className='absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary' />
                        <input placeholder='Search user...'
                            className='h-12 w-full pe-4 ps-14 focus:outline-none'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    {
                        !!selectedUsers.length && (
                            <div className='mt-4 flex flex-wrap gap-2 p2'>
                                {
                                    selectedUsers.map(user => (
                                        <SelectedUserTag
                                            key={user.id}
                                            user={user}
                                            onRemove={() => setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))}
                                        />
                                    ))
                                }
                            </div>
                        )
                    }
                    <hr />
                    <div className="h-96 overflow-y-auto">
                        {isSuccess && data.users.map((user) => (
                            <UserResult
                                key={user.id}

                                user={user}
                                selected={selectedUsers.some((u) => u.id === user.id)}
                                onClick={
                                    () => {
                                        setSelectedUsers((prev) => prev.some((u) => u.id === user.id)
                                            ? prev.filter((u) => u.id !== user.id)
                                            : [...prev, user])
                                    }
                                }
                            />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
interface UserResultProps {
    user: UserResponse<DefaultStreamChatGenerics>;
    selected: boolean;
    onClick: () => void
}
const UserResult = ({ user, selected, onClick }: UserResultProps) => {

    return (<button className='flex w-full items-center justify-between px-4 transition-colors hover:bg-muted/50' onClick={onClick}>
        <div className="flex items-cener gap-2">
            <UserAvatar avatarURL={user.image} />
            <div className="flex flex-col text-start">
                <p className="font-bold">{user.name}</p>
                <p className="text-muted-forground">@{user.username}</p>
            </div>
        </div>
        {selected && <Check className='size-5 text-green-500' />}
    </button>)

}

interface SelectedUserTagProps {
    user: UserResponse<DefaultStreamChatGenerics>;
    onRemove: () => void
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
    return (<button className='flex items-center gap-2 rounded-full border hover:bg-muted/50' onClick={onRemove}>
        <UserAvatar avatarURL={user.image} />
        <p className="font-bold">{user.name}</p>
        <X className='mx-2 size-5 text-muted-foreground' />
    </button>)
}