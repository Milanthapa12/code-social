"use client"
import { CommentData } from "@/lib/type"
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Delete, MoreHorizontal, Share, Trash, User } from "lucide-react"
import { useState } from "react"
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import CustomWarningDialog from "../ui/customWarningDialog"

import { useDeleteCommentMutation } from "./mutations"

interface ICommentMoreOptionProps {
  comment: CommentData,
  className?: string
}

export default function MoreOption({ comment, className }: ICommentMoreOptionProps) {

  const mutation = useDeleteCommentMutation(comment);
  const [showDialog, setShowDialog] = useState(false)
  return (<>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={"icon"} variant={'ghost'} className={className}>
          <MoreHorizontal className="size-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        {/* <DropdownMenuLabel>More</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => setShowDialog(!showDialog)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <CustomWarningDialog
      title="Delete comment ?"
      desctiption='Are you sure you want to delete this comment?'
      btnName='Delete'
      open={showDialog}
      onClose={() => setShowDialog(!showDialog)}
      data={comment}
      mutation={mutation}
    />
  </>)
}
