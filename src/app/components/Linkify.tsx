import { LinkIt, LinkItUrl } from "react-linkify-it"
import Link from "next/link"
import UserLinkWithTooltip from "./user/UserLinkWithTooltip"
interface ILinkifyProps {
    children: React.ReactNode
}

export default function Linkify({ children }: ILinkifyProps) {
    return (
        <LinkifyUsername>
            <HashTag>
                <LinkifyURL>{children}</LinkifyURL>
            </HashTag>
        </LinkifyUsername>
    )
}

function LinkifyURL({ children }: ILinkifyProps) {
    return <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
}

function LinkifyUsername({ children }: ILinkifyProps) {

    return <LinkIt regex={/(@[a-zA-Z0-9_-]+)/}
        component={(match, key) => (<UserLinkWithTooltip key={key} match={match} username={match.slice(1)}>{match}</UserLinkWithTooltip>
        )}
    >{children}</LinkIt>
}

function HashTag({ children }: ILinkifyProps) {
    return (<LinkIt regex={/(#[a-zA-Z0-9]+)/}
        component={(match, key) => (<Link key={key} href={`/hashtag/${match.slice(1)}`} className="text-primary hover:underline">
            {match}
        </Link>)}
    >{children}
    </LinkIt>)
}