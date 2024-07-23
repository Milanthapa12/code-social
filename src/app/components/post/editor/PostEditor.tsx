"use client"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import Placeholder from "@tiptap/extension-placeholder"
import { createPost } from "./action"
import UserAvatar from "@/app/components/ui/UserAvatar"
import { useSession } from "@/app/(main)/SessionProvider"
import { Button } from "@/app/components/ui/button"
import "./style.css"
import { useSubmitPostMutation } from "./mutations"
import LoadingButton from "@/app/components/ui/LoadingButton"

export default function PostEditor() {

    const { user } = useSession()
    const mutation = useSubmitPostMutation()

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false
            }),
            Placeholder.configure({
                placeholder: "What's on your mind !"
            })

        ]
    })

    const input = editor?.getText({
        blockSeparator: "\n"
    }) || ""

    function onSubmit() {
        mutation.mutate(input, {
            onSuccess: () => {
                editor?.commands.clearContent()
            }
        })
    }
    return (
        <div className="flex flex-col gap-5 bg-card rounded-2xl p-5 shadow-sm">
            <div className="flex gap-5">
                <UserAvatar avatarURL={user.avatar} className="hidden sm:inline" />
                <EditorContent
                    editor={editor}
                    className="tiptap w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-3 focus:border-0 outline:border-0"
                />
            </div>
            <div className="flex justify-end">
                <LoadingButton loading={mutation.isPending} onClick={onSubmit} disabled={!input.trim()} className="min-w-20">Post</LoadingButton>
            </div>
        </div>
    )
}
