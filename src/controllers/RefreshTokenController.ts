import { FastifyRequest, FastifyReply } from 'fastify'
import { RefreshTokenService } from '../services/RefreshTokenService'

interface RefreshTokenRequestBody {
    refreshToken: string
}

class RefreshTokenController {
    refreshTokenService: RefreshTokenService

    constructor(refreshTokenService: RefreshTokenService) {
        this.refreshTokenService = refreshTokenService
    }

    async handleRefreshToken(req: FastifyRequest, reply: FastifyReply) {
        const body = req.body as RefreshTokenRequestBody

        try {
            const refreshToken = body.refreshToken
            const newAccessToken =
                await this.refreshTokenService.generateAccessTokenFromRefreshToken(refreshToken)
            reply.send({ accessToken: newAccessToken })
        } catch (error) {
            if (error instanceof Error) {
                reply.status(400).send({ error: error.message })
            } else {
                reply.status(500).send({ error: 'Ocorreu um erro desconhecido.' })
            }
        }
    }
}

export { RefreshTokenController }
