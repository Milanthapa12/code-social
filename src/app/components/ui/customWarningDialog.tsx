import { PostData } from "@/lib/type"
import { useDeletePostMutation } from "../post/mutations";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog"
import { DialogFooter, DialogHeader } from "./dialog";
import LoadingButton from "./LoadingButton";
import { Button } from "./button";

interface IDeletePostDialog {
    title: string,
    desctiption: string,
    btnName: string,
    data: any,
    open: boolean,
    onClose: () => void
    mutation: any,
    variant?: "destructive" | "link" | "default" | "outline" | "secondary" | "ghost" | null | undefined
}

export default function CustomWarningDialog({
    title,
    desctiption,
    data,
    open,
    onClose,
    mutation,
    btnName,
    variant = "destructive"
}: IDeletePostDialog) {

    function handleDialogOpen() {
        if (!open || !mutation.isPending) {

        }

    }
    return (
        <Dialog open={open} onOpenChange={handleDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {desctiption}
                </DialogDescription>
                <DialogFooter>
                    <LoadingButton
                        loading={mutation.isPending}
                        variant={variant}
                        onClick={() => mutation.mutate(data.id, { onSuccess: onClose })}
                    >{btnName}
                    </LoadingButton>
                    <Button
                        variant={'outline'}
                        onClick={onClose}
                        disabled={mutation.isPending}
                    >Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
