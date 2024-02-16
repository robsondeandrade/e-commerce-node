import { FastifyInstance } from 'fastify'
import { FavoriteController } from '../controllers/FavoriteController'
import { FavoriteService } from '../services/FavoriteService'
import { authenticate } from '../middlewares/authenticate'

export default async (fastify: FastifyInstance) => {
    const favoriteService = new FavoriteService()
    const favoriteController = new FavoriteController(favoriteService)

    fastify.post(
        '/favorites',
        { preValidation: [authenticate] },
        favoriteController.addFavorite.bind(favoriteController),
    )

    fastify.get(
        '/favorites',
        { preValidation: [authenticate] },
        favoriteController.getUserFavorites.bind(favoriteController),
    )

    fastify.delete<{
        Params: {
            id: string
        }
    }>(
        '/favorites/:id',
        { preValidation: [authenticate] },
        favoriteController.removeFavorite.bind(favoriteController),
    )
}
