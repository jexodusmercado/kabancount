import { z } from 'zod'

export const LoginSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
})
export type LoginType = z.infer<typeof LoginSchema>

export const TokenSchema = z.object({
    accessToken: z.string(),
    expiresAt: z.number(),
    refreshToken: z.string(),
})

export type TokenType = z.infer<typeof TokenSchema>
