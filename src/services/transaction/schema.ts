import z from 'zod'
import { ProductSchema } from '../product/schema'

export const createTransactionItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    productVariantId: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
})

export type CreateTransactionItemType = z.infer<
    typeof createTransactionItemSchema
>

export const createTransactionSchema = z.object({
    type: z.string().default('PHYSICAL-STORE'),
    status: z.string().default('DONE'),
    paymentMethod: z.string().default('CASH'),
    items: z.array(createTransactionItemSchema),
})

export type CreateTransactionType = z.infer<typeof createTransactionSchema>

export const transactionItemSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    quantity: z.number(),
    price: z.number(),
    product: ProductSchema.pick({ id: true, name: true }).optional(),
    productVariant: ProductSchema.optional(),
})

export type TransactionItemType = z.infer<typeof transactionItemSchema>

export const transactionSchema = z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    type: z.string(),
    total_amount: z.number(),
    status: z.string(),
    payment_method: z.string(),
    transaction_items: z.array(transactionItemSchema).optional(),
})

export type TransactionType = z.infer<typeof transactionSchema>

export const PaginatedTransactionSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    results: z.array(transactionSchema),
})
