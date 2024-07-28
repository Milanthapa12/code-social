import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog"
import { DialogFooter, DialogHeader } from "./dialog";
import LoadingButton from "./LoadingButton";
import { Button } from "./button";

interface ICustomDialog {
    title: string,
    body: React.ReactNode,
    btnName: string,
    open: boolean,
    onClose: () => void
    mutation: any,
    values: any,
    variant?: "destructive" | "link" | "default" | "outline" | "secondary" | "ghost" | null | undefined
}

export default function CustomDialog({
    values,
    title,
    body,
    open,
    onClose,
    mutation,
    btnName,
    variant = "destructive"
}: ICustomDialog) {

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
                    {body}
                </DialogDescription>
                <DialogFooter>
                    <LoadingButton
                        loading={mutation.isPending}
                        variant={variant}
                        onClick={() => {
                            mutation.mutate({
                                values
                            }, { onSuccess: onClose })
                        }}
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
