import z from 'zod'

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
