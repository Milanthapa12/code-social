"use client"
import { useState } from "react"

interface PostTextContainerProps {
    content: string
}
export default function PostTextContainer({ content }: PostTextContainerProps) {

    const [showFullContent, setShowFullContent] = useState(false)
    const fullContentHandler = () => setShowFullContent(!showFullContent)

    const makeContentShorter = () => {
        if (content.length < 200) {
            return content
        } else if (showFullContent) {
            return <>{content}{" "}<span className="text-muted-foreground cursor-pointer" onClick={fullContentHandler}>...less</span></>
        }
        return <>{content.substring(0, 200)}{" "}<span className="text-muted-foreground cursor-pointer" onClick={fullContentHandler}>...more</span></>
    }

    return (
        <div>
            {makeContentShorter()}
        </div>
    )
}
