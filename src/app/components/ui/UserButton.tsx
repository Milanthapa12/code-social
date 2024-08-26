"use client"

import { useSession } from "@/app/(main)/SessionProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "./dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import UserAvatar from "./UserAvatar"
import Link from "next/link"
import { Check, LogOut, Monitor, Moon, Sun, UserIcon } from "lucide-react"
import { logout } from "@/app/(auth)/actions"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useQueryClient } from "@tanstack/react-query"

interface IUserButtonProps {
    className?: string
}

export default function UserButton({ className }: IUserButtonProps) {

    const { user } = useSession()
    const { theme, setTheme } = useTheme()
    const queryClient = useQueryClient()

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className={cn("flex-none rounded-full", className)}>
                <UserAvatar avatarURL={user.avatarUrl} size={40} />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${user.username}`}>
                <DropdownMenuItem>
                    <UserIcon className="mr-2 size-4" />
                    Profile
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Monitor className="mr-2 size-4" />Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme('system')}>
                            <Monitor className="mr-3 size-4" />
                            System Default {theme === "system" && <Check className="ms-2 text-green-600 size-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>
                            <Moon className="mr-3 size-4" />
                            Dark {theme === "dark" && <Check className="ms-2 text-green-600 size-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('light')} >
                            <Sun className="mr-3 size-4" />
                            Light {theme === "light" && <Check className="ms-2 text-green-600 size-4" />}
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
                queryClient.clear()
                logout()
            }}>
                <LogOut className="mr-2 size-4" />
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}