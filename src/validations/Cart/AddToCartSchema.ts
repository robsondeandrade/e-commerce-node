import { z } from 'zod'

const AddToCartSchema = z.object({
    title: z.string(),
    thumbnail: z.string(),
    productId: z.string(),
    available_quantity: z.number(),
    price: z.number(),
    quantity: z.number().optional(),
})

export { AddToCartSchema }
