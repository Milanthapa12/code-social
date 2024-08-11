import { PostData } from "@/lib/type"
import { useState } from "react"
import { useSubmitCommentMutation } from "./mutations"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2, SendHorizonal } from "lucide-react"

interface ICommentInputProps {
    post: PostData
}

export default function CommentInput({ post }: ICommentInputProps) {
    const [input, setInput] = useState("")
    const mutation = useSubmitCommentMutation(post.id)
    async function submitCommentHandler(e: React.FormEvent) {
        e.preventDefault()
        if (!input) return;
        mutation.mutate({
            post,
            content: input
        }, {
            onSuccess: () => setInput("")
        })
    }

    return (
        <form className="flex w-full items-center gap-2" onSubmit={submitCommentHandler}>
            <Input
                placeholder="Write a comment..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
            />
            <Button
                type="submit" variant={'ghost'}
                size={'icon'}
                disabled={!input.trim() || mutation.isPending}
            >
                {
                    !mutation.isPending ? (
                        <SendHorizonal />
                    ) : (<Loader2 className="animate-spin" />)
                }
            </Button>
        </form>
    )
}
