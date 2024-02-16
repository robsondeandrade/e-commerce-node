import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { FavoriteService } from '../services/FavoriteService'
import { AddFavoriteSchema } from '../validations/favorite/AddFavoriteSchema'

interface RemoveFavoriteParams {
    id: string
}

class FavoriteController {
    constructor(private favoriteService: FavoriteService) {}

    async addFavorite(req: FastifyRequest, reply: FastifyReply) {
        if (!this.isAuthenticated(req, reply)) return

        try {
            const userId = req.user!.userId
            const favoriteData = AddFavoriteSchema.parse(req.body)
            const favorite = await this.favoriteService.addFavorite({ userId, favoriteData })

            reply.send(favorite)
        } catch (error) {
            this.handleError(error, reply)
        }
    }

    async removeFavorite(
        req: FastifyRequest<{ Params: RemoveFavoriteParams }>,
        reply: FastifyReply,
    ) {
        if (!this.isAuthenticated(req, reply)) return

        try {
            const userId = req.user!.userId
            const favoriteId = req.params.id

            await this.favoriteService.removeFavorite(favoriteId, userId)
            reply.send({ message: 'Produto removido com sucesso.' })
        } catch (error) {
            this.handleError(error, reply)
        }
    }

    async getUserFavorites(req: FastifyRequest, reply: FastifyReply) {
        if (!this.isAuthenticated(req, reply)) return

        try {
            const userId = req.user!.userId
            const favorites = await this.favoriteService.findFavoritesByUserId(userId)

            reply.send(favorites)
        } catch (error) {
            this.handleError(error, reply)
        }
    }

    private isAuthenticated(req: FastifyRequest, reply: FastifyReply): boolean {
        if (!req.user || !('userId' in req.user)) {
            reply.status(401).send({ message: 'Usuário não autenticado' })
            return false
        }
        return true
    }

    private handleError(error: unknown, reply: FastifyReply) {
        if (error instanceof ZodError) {
            reply.status(400).send({ errors: error.errors })
        } else {
            reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    }
}

export { FavoriteController }
