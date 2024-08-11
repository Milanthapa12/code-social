import { z } from "zod"

const requiredField = (field: string) => z.string().trim().min(1, `${field.charAt(0).toLocaleUpperCase()}${field.slice(1)} field is required.`)

export const registerRequestValidation = z.object({
    name: requiredField('name').max(150, 'Name field is too long'),
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
    content: requiredField("content"),
    mediaIds: z.array(z.string())
})

export const updateUserProfileSchema = z.object({
    name: requiredField("name"),
    bio: z.string().max(1000, "Must be at most 1000 charecters")
})

export type UploadUserProfileValues = z.infer<typeof updateUserProfileSchema>

export const createCommentSchema = z.object({
    content: requiredField('content')
})