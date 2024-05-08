import { z } from 'zod'

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Required'),
})

export type SignInType = z.infer<typeof SignInSchema>

export const TokenSchema = z.object({
    accessToken: z.string(),
    expiresAt: z.number(),
    refreshToken: z.string(),
})

export type TokenType = z.infer<typeof TokenSchema>

export const SignUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    companyName: z.string(),
    password: z.string(),
})

export type SignUpType = z.infer<typeof SignUpSchema>
