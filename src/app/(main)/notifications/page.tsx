import TrendingBlock from "@/app/components/ui/TrendingBlock";
import Notifications from "./Notifications";

export default function page() {
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <h1 className="rounded-2xl bg-card p-5">Notifications</h1>
                <Notifications />
            </div>
            <TrendingBlock />
        </main>
    )
}
