// src/routes/CartRoutes.ts
import { FastifyInstance } from 'fastify'
import { CartService } from '../services/CartService'
import { authenticate } from '../middlewares/authenticate'
import { CartController } from '../controllers/CartUserController'

export default async (fastify: FastifyInstance) => {
    const cartService = new CartService()
    const cartController = new CartController(cartService)

    fastify.post(
        '/cart',
        { preValidation: [authenticate] },
        cartController.addToCart.bind(cartController),
    )

    fastify.get(
        '/cart',
        { preValidation: [authenticate] },
        cartController.getCart.bind(cartController),
    )

    fastify.delete<{
        Params: {
            id: string
        }
    }>(
        '/cart/:id',
        { preValidation: [authenticate] },
        cartController.removeFromCart.bind(cartController),
    )

    fastify.delete(
        '/cart',
        { preValidation: [authenticate] },
        cartController.clearCart.bind(cartController),
    )
}
