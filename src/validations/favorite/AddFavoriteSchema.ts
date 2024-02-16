import { z } from 'zod'

export const AddFavoriteSchema = z.object({
    title: z.string(),
    thumbnail: z.string(),
    quantity: z.number(),
    available_quantity: z.number(),
    price: z.number(),
})
