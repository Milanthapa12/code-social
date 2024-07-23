import { z } from "zod"

const requiredField = (field: string) => z.string().trim().min(1, `${field.charAt(0).toLocaleUpperCase()}${field.slice(1)} field is required.`)

export const registerRequestValidation = z.object({
    email: requiredField('email').email("Invalid Email provided"),
    username: requiredField('username').regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _ are allowed."),
    password: requiredField('password').min(8, "Password must be at least 8 charecters long.")
        .max(50, "Too long password provided.")
})

export type RegisterValues = z.infer<typeof registerRequestValidation>

export const loginRequestValidation = z.object({
    username: requiredField('username'),
    password: requiredField('password')
})

export type LoginValues = z.infer<typeof loginRequestValidation>


export const postValidation = z.object({
    content: requiredField("content")
})