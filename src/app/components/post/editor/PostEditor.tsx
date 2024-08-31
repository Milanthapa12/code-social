"use client"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import StarterKit from '@tiptap/starter-kit'
import Placeholder from "@tiptap/extension-placeholder"
import UserAvatar from "@/app/components/ui/UserAvatar"
import { useSession } from "@/app/(main)/SessionProvider"
import { Button } from "@/app/components/ui/button"
import "./style.css"
import { useSubmitPostMutation } from "./mutations"
import LoadingButton from "@/app/components/ui/LoadingButton"
import useMediaUpload, { Attachment } from "./useMediaUpload"
import { useRef } from "react"
import { ImageIcon, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useDropzone } from "@uploadthing/react"

export default function PostEditor() {

    const { user } = useSession()
    const mutation = useSubmitPostMutation()
    const { startUpload,
        attachments,
        isUploading,
        uploadProgress,
        removeAttachment,
        resetMediaUpload } = useMediaUpload()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: startUpload })

    const { onClick, ...rootProps } = getRootProps() // removing onClick envent

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
        const mediaIds = attachments.map((a) => a.mediaId).filter(Boolean) ?? []
        mutation.mutate({
            content: input,
            mediaIds: mediaIds as string[]
        }, {
            onSuccess: () => {
                editor?.commands.clearContent()
                resetMediaUpload()
            }
        })
    }
    return (
        <div className="flex flex-col gap-5 container-border-radius bg-card p-5 shadow-sm">
            <div className="flex gap-5">
                <UserAvatar avatarURL={user.avatarUrl} className="hidden sm:inline" />
                <div {...rootProps} className="w-full">
                    <EditorContent
                        editor={editor}
                        className={cn("tiptap w-full max-h-[10rem] overflow-y-auto bg-background rounded-2xl px-5 py-3 focus:border-0 outline:border-0", isDragActive && "outline-dashed")}
                    />
                    <input {...getInputProps} type="hidden" />
                </div>
            </div>
            {!!attachments.length && (<AttachmentPreviews attachemnts={attachments} removeAttachment={removeAttachment} />)}
            <div className="flex items-center justify-end gap-3">
                {isUploading && (
                    <>
                        <span className="text-sm">{uploadProgress ?? 0}%</span>
                        <Loader2 className="size-5 animate-spin text-primary" />
                    </>
                )}
                <AddAttachmentsButton onFilesSelected={startUpload}
                    disabled={isUploading || attachments.length >= +(process.env.NEXT_MAX_FILE_UPLOAD_COUNT || 5)}
                />
                <LoadingButton loading={mutation.isPending} onClick={onSubmit} disabled={!input.trim() || isUploading} className="min-w-20">Post</LoadingButton>
            </div>
        </div>
    )
}


interface AddAttachmentsButtonProps {
    onFilesSelected: (files: File[]) => void
    disabled: boolean
}

function AddAttachmentsButton({ onFilesSelected, disabled }: AddAttachmentsButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (<>
        <Button variant={"ghost"} size={"icon"} className="text-primary hover:text-primary"
            disabled={disabled} onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={20} />
        </Button>
        <input type="file" accept="image/*, video/*"
            multiple
            ref={fileInputRef}
            className="hidden sr-only"
            onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length) {
                    onFilesSelected(files)
                    e.target.value = ""
                }
            }}
        />
    </>)
}

interface AttachmentPreviewsProps {
    attachemnts: Attachment[],
    removeAttachment: (fileName: string) => void
}

function AttachmentPreviews({ attachemnts, removeAttachment }: AttachmentPreviewsProps) {

    return (<div className={cn("flex flex-col gap-3", attachemnts.length > 1 && "sm:grid sm:grid-cols-2")}>
        {attachemnts.map((att) => (
            <AttachmentPreview
                key={att.file.name}
                attachment={att}
                onRemoveClick={() => removeAttachment(att.file.name)}
            />
        ))}
    </div>)
}

interface IAttachmentPreviewProps {
    attachment: Attachment,
    onRemoveClick: () => void
}

function AttachmentPreview({ attachment: { file, mediaId, isUploading }, onRemoveClick }: IAttachmentPreviewProps) {

    const imgSRC = URL.createObjectURL(file)

    return (<div className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}>
        {
            file.type.startsWith("image") ? (<Image
                src={imgSRC}
                alt="preview"
                width={500}
                height={500}
                className="size-fit max-h-[30rem] rounded-2xl"
            />) : (<video controls className="size-fit max-h-[30rem] rounded-2xl">
                <source src={imgSRC} type={file.type} />
            </video>)
        }
        {!isUploading && (<button onClick={onRemoveClick} className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background translate-colors hover:bg-foreground">
            <X size={20} />
        </button>)}
    </div>)
}
