import { z } from 'zod'

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
})

export type SignInType = z.infer<typeof SignInSchema>

export const TokenSchema = z.object({
    token: z.string(),
    expiresAt: z.string(),
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
