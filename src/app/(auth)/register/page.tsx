import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import RegisterForm from "./RegisterForm"

export const metadata: Metadata = {
    title: 'Register'
}
export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center p-5">
            <div className="shadow-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card">
                <div className="md:w-1/2 w-full space-y-10 overflow-y-auto">
                    <div className="space-y-1 text-center pt-6">
                        <h1 className="text-3xl font-bold">Register to Code Social</h1>
                        <p className="text-muted-forground">
                            A place where coder can find a friend
                        </p>
                    </div>
                    <div className="space-y-5 px-6">
                        {/* Register form */}
                        <RegisterForm />
                        <Link href={'/login'} className="text-center block hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
                <Image
                    src={'/assets/signup-image.jpg'}
                    alt="register"
                    loading="lazy"
                    width={100}
                    height={100}
                    className="w-1/2 object-cover hidden md:block"
                />
            </div>
        </main>
    )
}