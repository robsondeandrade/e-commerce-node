import { FastifyInstance } from 'fastify'
import { authenticate } from '../middlewares/authenticate'
import { RefreshTokenService } from '../services/RefreshTokenService'
import { RefreshTokenController } from '../controllers/RefreshTokenController'
import { LoginUserService } from '../services/LoginUserService'
import { LoginController } from '../controllers/LoginUserController'

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
    const loginUserService = new LoginUserService()
    const refreshTokenService = new RefreshTokenService()

    const loginUserController = new LoginController(loginUserService)
    const refreshTokenController = new RefreshTokenController(refreshTokenService)

    fastify.post('/login', loginUserController.login.bind(loginUserController))

    fastify.post(
        '/refresh-token',
        { preValidation: [authenticate] },
        refreshTokenController.handleRefreshToken.bind(refreshTokenController),
    )
}
