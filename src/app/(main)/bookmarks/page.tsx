import { Metadata } from "next";
import Bookmarked from "./Bookmarked";
import TrendingBlock from "@/app/components/ui/TrendingBlock";

export const metadata: Metadata = {
    title: "Bookmark"
}

export default function page() {
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <h1 className="rounded-2xl bg-card p-5">Bookmarks</h1>
                <Bookmarked />
            </div>
            <TrendingBlock />
        </main>
    )
}
