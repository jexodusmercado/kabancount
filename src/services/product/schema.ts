import z from 'zod'
import { InventorySchema } from '../inventory/schema'

export const ProductVariantSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    productId: z.string(),
    name: z.string(),
    value: z.string(),
    basePrice: z.number(),
    costPrice: z.number(),
    sku: z.string(),
    barcode: z.string(),
    status: z.string(),
    inventory: InventorySchema,
})

export type ProductVariantType = z.infer<typeof ProductVariantSchema>

export const ProductSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    companyId: z.string(),
    categoryId: z.string(),
    name: z.string(),
    slug: z.string(),
    sku: z.string(),
    barcode: z.string(),
    basePrice: z.number(),
    costPrice: z.number(),
    status: z.string(),
    inventory: InventorySchema,
    variants: z.array(ProductVariantSchema).nullish(),
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
    variantID: z.string().optional(),
    variantOptionName: z.string().optional(),
    variantOptionValue: z.string().min(1, 'Variant option value is required'),
    variantSKU: z.string().optional(),
    variantBarcode: z.string().optional(),
    variantBasePrice: z.number().min(1, 'Variant base price is required'),
    variantCostPrice: z.number().default(0),
    variantStatus: z.string().default('active'),
    variantQuantity: z.number().default(0),
})

export type MutableProductVariantType = z.infer<
    typeof MutableProductVariantSchema
>

export const MutableProductSchema = z
    .object({
        categoryID: z.string(),
        productName: z.string().min(1, 'Product name is required'),
        productSKU: z.string().optional(),
        productBarcode: z.string().optional(),
        productBasePrice: z.number().min(1, 'Product base price is required'),
        productCostPrice: z.number().default(0),
        productQuantity: z.number().default(0),
        productStatus: z.string().min(1, 'Product status is required'),
        deletedVariantIDs: z.array(z.string()).optional(),
        variantOptionName: z.string().optional(),
        variants: z.array(MutableProductVariantSchema.optional()),
    })
    .refine(
        (data) => {
            if (data.variants.length > 0 && !data.variantOptionName) {
                return false
            }

            return true
        },
        {
            message: 'Variant option name is required',
            path: ['variantOptionName'],
        },
    )

export type MutableProductType = z.infer<typeof MutableProductSchema>
