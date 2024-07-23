import SearchInput from "@/app/components/ui/SearchInput";
import UserButton from "@/app/components/ui/UserButton";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="sticky top-0 z-10 bg-card shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-5 px-5 py-3">
                <Link href={'/'} className="text-2xl font-bold text-primary">Code Social</Link>
                <SearchInput />
                <UserButton className="sm:ms-auto" />
            </div>
        </div>
    )
}
