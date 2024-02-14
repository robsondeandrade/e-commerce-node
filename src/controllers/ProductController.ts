import { FastifyReply, FastifyRequest } from 'fastify'
import { ProductService } from '../services/ProductService'

interface QueryParams {
    search?: string
    offset?: string
    limit?: string
    sort?: string
}

class ProductController {
    productService: ProductService

    constructor(productService: ProductService) {
        this.productService = productService
    }

    async getProducts(req: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
        const { search = 'Ofertas', offset = '0', limit = '10', sort = 'relevance' } = req.query

        try {
            const products = await this.productService.fetchProducts({
                search,
                offset: Number(offset),
                limit: Number(limit),
                sort,
            })
            reply.send(products)
        } catch (error) {
            this.handleError(reply, error)
        }
    }

    private handleError(reply: FastifyReply, error: unknown) {
        if (error instanceof Error) {
            reply.status(500).send({ message: error.message })
        } else {
            reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    }
}

export { ProductController }
