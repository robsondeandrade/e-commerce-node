// src/services/CartService.ts
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { AddToCartSchema } from '../validations/Cart/AddToCartSchema'

const prisma = new PrismaClient()

interface AddCartData {
    userId: string
    cartData: z.infer<typeof AddToCartSchema>
}

class CartService {
    async addToCart({ userId, cartData }: AddCartData) {
        const existingItem = await prisma.cart.findFirst({
            where: {
                userId,
                productId: cartData.productId,
            },
        })

        if (existingItem) {
            return await prisma.cart.update({
                where: { id: existingItem.id },
                data: {
                    quantity: cartData.quantity || existingItem.quantity + (cartData.quantity || 1),
                },
            })
        } else {
            return await prisma.cart.create({
                data: {
                    userId,
                    ...cartData,
                },
            })
        }
    }

    async getCart(userId: string) {
        return await prisma.cart.findMany({
            where: {
                userId,
            },
        })
    }

    async removeFromCart(cartItemId: string) {
        return await prisma.cart.delete({
            where: { id: cartItemId },
        })
    }

    async clearCart(userId: string) {
        return await prisma.cart.deleteMany({
            where: { userId },
        })
    }
}

export { CartService }
