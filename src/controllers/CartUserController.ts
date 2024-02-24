// src/controllers/CartController.ts
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { CartService } from '../services/CartService'
import { AddToCartSchema } from '../validations/Cart/AddToCartSchema'

interface CartRequestParams {
    id: string
}

class CartController {
    constructor(private cartService: CartService) {}

    async addToCart(req: FastifyRequest, reply: FastifyReply) {
        if (!this.isAuthenticated(req, reply)) return

        try {
            const userId = req.user!.userId
            const cartData = AddToCartSchema.parse(req.body)
            const cartItem = await this.cartService.addToCart({ userId, cartData })

            reply.send(cartItem)
        } catch (error) {
            this.handleError(error, reply)
        }
    }

    async getCart(req: FastifyRequest, reply: FastifyReply) {
        if (!this.isAuthenticated(req, reply)) return

        try {
            const userId = req.user!.userId
            const cartItems = await this.cartService.getCart(userId)

            reply.send(cartItems)
        } catch (error) {
            this.handleError(error, reply)
        }
    }

    async removeFromCart(req: FastifyRequest<{ Params: CartRequestParams }>, reply: FastifyReply) {
        if (!this.isAuthenticated(req, reply)) return

        const { id } = req.params

        try {
            await this.cartService.removeFromCart(id)
            reply.send({ message: 'Item removido do carrinho com sucesso.' })
        } catch (error) {
            this.handleError(error, reply)
        }
    }

    async clearCart(req: FastifyRequest, reply: FastifyReply) {
        if (!this.isAuthenticated(req, reply)) return

        const userId = req.user!.userId
        try {
            await this.cartService.clearCart(userId)
            reply.send({ message: 'Carrinho limpo com sucesso.' })
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
export { CartController }
