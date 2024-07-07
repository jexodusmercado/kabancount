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

export const pointOfSaleCategoryItemsSchema = z.object({
    ID: z.string(),
    variantID: z.string().nullish(),
    productName: z.string(),
    variantName: z.string().nullish(),
    variantValue: z.string().nullish(),
    imageURL: z.string(),
    originalPrice: z.number(),
    isDiscounted: z.boolean(),
    price: z.number(),
    quantity: z.number(),
})

export type PointOfSaleCategoryItemsType = z.infer<
    typeof pointOfSaleCategoryItemsSchema
>

export const pointOfSaleCategorySchema = z.object({
    ID: z.string(),
    name: z.string(),
    items: z.array(pointOfSaleCategoryItemsSchema).nullish(),
})

export type PointOfSaleCategoryType = z.infer<typeof pointOfSaleCategorySchema>

export const pointOfSaleCategoryListSchema = z.array(pointOfSaleCategorySchema)

export type PointOfSaleCategoryListType = z.infer<
    typeof pointOfSaleCategoryListSchema
>
