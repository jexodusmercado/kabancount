import z from 'zod'

export const InventorySchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    quantity: z.number(),
})

export type InventoryType = z.infer<typeof InventorySchema>
