import { z } from 'zod'
import { ProductSchema } from '../product/schema'

export const categorySchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    name: z.string(),
    description: z.string(),
    companyId: z.string(),
    products: z.array(ProductSchema).nullish(),
})

export type CategoryType = z.infer<typeof categorySchema>

export const PaginatedCategoriesSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    results: z.array(categorySchema),
})

export const mutableCategorySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
})

export type MutableCategoryType = z.infer<typeof mutableCategorySchema>
