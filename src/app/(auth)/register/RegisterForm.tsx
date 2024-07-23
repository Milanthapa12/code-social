"use client"

import { registerRequestValidation, RegisterValues } from "@/lib/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { useState, useTransition } from "react"
import { register } from "./actions"
import { PasswordInput } from "@/app/components/ui/PasswordInput"
import LoadingButton from "@/app/components/ui/LoadingButton"

export default function RegisterForm() {

    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerRequestValidation),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        }
    })

    async function onSubmit(values: RegisterValues) {
        setError(undefined)
        startTransition(async () => {
            const { error } = await register(values)
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
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} />
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
                                <PasswordInput placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton loading={isPending} type="submit" className="w-full">Create account</LoadingButton>
            </form>
        </Form>
    )
}
