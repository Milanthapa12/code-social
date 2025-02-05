"use client"

import { loginRequestValidation, LoginValues, registerRequestValidation, RegisterValues } from "@/lib/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
// import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { login } from "./actions"
import LoadingButton from "@/app/components/ui/LoadingButton"
import { PasswordInput } from "@/app/components/ui/PasswordInput"

export default function LoginForm() {
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const form = useForm<RegisterValues>({
        resolver: zodResolver(loginRequestValidation),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    async function onSubmit(values: LoginValues) {
        setError(undefined)
        startTransition(async () => {
            const { error } = await login(values)
            if (error) setError(error)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {error && <p className="text-centet text-destructive">{error}</p>}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton loading={isPending} type="submit" className="w-full">Login</LoadingButton>
            </form>
        </Form>
    )
}
