import { Metadata } from "next"
import Link from "next/link"
import LoginForm from "./LoginForm"
import GoogleLoginButton from "./google/GoogleLoginButton"
export const metadata: Metadata = {
    title: 'Login'
}
export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center p-5">
            <div className="shadow-2xl flex h-full max-h-[32rem] w-full max-w-[28rem] rounded-xl overflow-hidden bg-card">
                <div className="w-full space-y-10 overflow-y-auto">
                    <div className="space-y-1 text-center pt-6">
                        <h1 className="text-3xl font-bold">Login to Social Echo</h1>
                        <p className="text-muted-forground">
                            Let&lsquo;s make new friends
                        </p>
                    </div>
                    <div className="space-y-5 px-6">
                        <GoogleLoginButton />
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-muted" />
                            <span>OR</span>
                            <div className="h-px flex-1 bg-muted" />
                        </div>
                        {/* Register form */}
                        <LoginForm />
                        <Link href={'/register'} className="text-center block hover:underline">
                            New to Social Echo? Regiser
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}