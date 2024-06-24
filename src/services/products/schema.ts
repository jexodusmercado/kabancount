import z from 'zod'
import { InventorySchema } from '../inventory/schema'

export const ProductVariantSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    productId: z.string(),
    name: z.string(),
    description: z.string(),
    basePrice: z.number(),
    costPrice: z.number(),
    status: z.string(),
    inventory: InventorySchema,
})

export type ProductVariantType = z.infer<typeof ProductVariantSchema>

export const ProductSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    companyId: z.string(),
    name: z.string(),
    slug: z.string(),
    status: z.string(),
    variants: z.array(ProductVariantSchema),
})

export type ProductType = z.infer<typeof ProductSchema>

export const ProductsSchema = z.array(ProductSchema)

export type ProductsType = z.infer<typeof ProductsSchema>

export const PaginatedProductsSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    results: ProductsSchema,
})

export type PaginatedProductsType = z.infer<typeof PaginatedProductsSchema>

export const MutableProductVariantSchema = z.object({
    variantName: z.string().min(1, 'Variant name must not be empty'),
    variantDescription: z.string().optional(),
    basePrice: z.number().min(0, 'Base price must be greater than 0'),
    costPrice: z.number().default(0),
    variantStatus: z.string().default('ACTIVE'),
    inventoryQuantity: z
        .number()
        .min(0, 'Inventory quantity must be greater than 0'),
})

export type MutableProductVariantType = z.infer<
    typeof MutableProductVariantSchema
>

export const MutableProductSchema = z.object({
    productName: z.string().min(1, 'Product name must not be empty'),
    productStatus: z.string().default('ACTIVE'),
    variants: z.array(MutableProductVariantSchema),
})

export type MutableProductType = z.infer<typeof MutableProductSchema>
