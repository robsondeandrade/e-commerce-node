import { z } from 'zod'

export const AddFavoriteSchema = z.object({
    title: z.string(),
    thumbnail: z.string(),
    favoriteId: z.string(),
    available_quantity: z.number(),
    price: z.number(),
})
