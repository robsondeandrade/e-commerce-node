import { PrismaClient } from '@prisma/client'
import { AddFavoriteSchema } from '../validations/favorite/AddFavoriteSchema'
import { z } from 'zod'

const prisma = new PrismaClient()

interface AddFavoriteData {
    userId: string
    favoriteData: z.infer<typeof AddFavoriteSchema>
}

class FavoriteService {
    async addFavorite({ userId, favoriteData }: AddFavoriteData) {
        const favorite = await prisma.favorite.create({
            data: {
                userId,
                ...favoriteData,
            },
        })
        return favorite
    }

    async removeFavorite(favoriteId: string, userId: string) {
        const favorite = await prisma.favorite.deleteMany({
            where: {
                id: favoriteId,
                userId: userId,
            },
        })
        return favorite
    }

    async findFavoritesByUserId(userId: string) {
        return await prisma.favorite.findMany({
            where: {
                userId,
            },
        })
    }
}

export { FavoriteService }
