import { z } from 'zod'

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

export const mediaSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    company_id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.string(),
})

export type MediaType = z.infer<typeof mediaSchema>

export const mediasSchema = z.array(mediaSchema)

export type MediasType = z.infer<typeof mediasSchema>

export const paginatedMediaSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    results: z.array(mediaSchema),
})

export type PaginatedMediaType = z.infer<typeof paginatedMediaSchema>

export const createMediaSchema = z.object({
    images: z
        .custom<File[]>()
        .refine((file) => file && file.length > 0, {
            message: 'File is required',
        })
        .refine((file) => file && file.length < 10, {
            message: 'You can upload up to 10 files',
        })
        .refine((file) => file && file.every((f) => f.size < 25000000), {
            message: 'File size must be less than 25MB',
        })
        .refine(
            (file) =>
                file &&
                file.every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type)),
            {
                message: 'File must be an image',
            },
        ),
})

export type CreateMediaType = z.infer<typeof createMediaSchema>
