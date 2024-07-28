"use client"
import { UserData } from "@/lib/type"
import { useUpdateProfileMutation } from "./mutation"
import { updateUserProfileSchema, UploadUserProfileValues } from "@/lib/validation"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { startTransition, useRef, useState, useTransition } from "react"
import LoadingButton from "@/app/components/ui/LoadingButton"
import { updateUserProfile } from "./action"
import Image, { StaticImageData } from "next/image"
import { Label } from "@/app/components/ui/label"
import { Camera } from "lucide-react"
import CropImageDialog from "@/app/components/CropImageDialog"
// import avatarPlaceHolder from "@assets/avatar-placeholder.png"
import Resizer from "react-image-file-resizer"


interface IEditProfileProps {
    user: UserData
}
export default function EditProfile({ user }: IEditProfileProps) {

    const [showModal, setShowModal] = useState(false)
    const mutation = useUpdateProfileMutation()

    function handleDialogOpen() {
        if (!open || !mutation.isPending) {
            setShowModal(false)
        }
    }
    const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)
    const [error, setError] = useState<string>()

    const form = useForm<UploadUserProfileValues>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            name: user.name || "",
            bio: ""
        }
    })

    async function onSubmit(values: UploadUserProfileValues) {
        const newAvatarFile = croppedAvatar ? new File([croppedAvatar], `avatar_${user.id}.webp`)
            : undefined
        setError(undefined)
        startTransition(async () => {
            await mutation.mutate({
                values,
                avatar: newAvatarFile
            }, {
                onSuccess: () => {
                    setCroppedAvatar(null)
                    handleDialogOpen()
                }
            })
        })
    }

    return (<>
        <Button variant={'outline'} onClick={() => setShowModal(true)}  >Edit Profile</Button>
        <Dialog open={showModal} onOpenChange={handleDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <div className="space-y-1 5">
                        <Label>Avatar</Label>
                        <AvatarInput
                            src={croppedAvatar ? URL.createObjectURL(croppedAvatar) : user.avatar || "/assets/avatar-placeholder.png"}
                            onImageCropped={setCroppedAvatar}
                        />
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" id="update_profile-form">
                            {error && <p className="text-centet text-destructive">{error}</p>}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Bio" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </DialogDescription>
                <DialogFooter>
                    <LoadingButton
                        form="update_profile-form"
                        loading={mutation.isPending}
                        variant={"ghost"}
                        type={"submit"}
                    >Update
                    </LoadingButton>
                    <Button
                        variant={'outline'}
                        onClick={() => setShowModal(false)}
                        disabled={mutation.isPending}
                    >Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>)
}

interface AvatarInputProps {
    src: string | StaticImageData,
    onImageCropped: (blob: Blob | null) => void
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
    const [imageToCrop, setImageToCrop] = useState<File>()
    const fileRef = useRef<HTMLInputElement>(null)

    function onImageSelected(image: File | undefined) {
        if (!image) return
        Resizer.imageFileResizer(image,
            1024,
            1024,
            "WEBP",
            100,
            0,
            (uri) => setImageToCrop(uri as File),
            "file"
        )
    }

    return <>
        <input
            type="file"
            accept="images/*"
            onChange={(e) => onImageSelected(e.target?.files?.[0])}
            ref={fileRef}
            className="hidden sr-only"
        />
        <button type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative block"
        >
            <Image
                src={src}
                alt="Avatar preview"
                width={150}
                height={150}
                className="size-32 flex-none rounded-full object-cover"
            />
            <span className="absolute inset-0 m-auto size-12 flex items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
                <Camera size={24} />
            </span>
        </button>
        {
            imageToCrop && (
                <CropImageDialog
                    src={URL.createObjectURL(imageToCrop)}
                    cropAspectRatio={1}
                    onCropped={onImageCropped}
                    onClose={() => {
                        setImageToCrop(undefined)
                        if (fileRef.current) {
                            fileRef.current.value = ""
                        }
                    }}
                />
            )
        }
    </>
}
