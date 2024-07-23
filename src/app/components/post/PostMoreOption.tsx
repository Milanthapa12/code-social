"use client"
import { PostData } from "@/lib/type"
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Delete, MoreHorizontal, Share, Trash, User } from "lucide-react"
import { useState } from "react"
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import CustomWarningDialog from "../ui/customWarningDialog"

import { useDeletePostMutation } from '../../components/post/mutations'

interface IPostMoreOptionProps {
  post: PostData,
  className?: string
}

export default function PostMoreOption({ post, className }: IPostMoreOptionProps) {

  const mutation = useDeletePostMutation();
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
          <DropdownMenuItem className="flex items-center cursor-pointer">
            <Share className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => setShowDialog(!showDialog)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <CustomWarningDialog
      title="Delete Post ?"
      desctiption='Are you sure you want to delete this post?'
      btnName='Delete'
      open={showDialog}
      onClose={() => setShowDialog(!showDialog)}
      data={post}
      mutation={mutation}
    />
  </>)
}
