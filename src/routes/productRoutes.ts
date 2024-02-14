import { FastifyInstance } from 'fastify'
import { ProductService } from '../services/ProductService'
import { ProductController } from '../controllers/ProductController'

export default async function productRoutes(fastify: FastifyInstance): Promise<void> {
    const productService = new ProductService()
    const productController = new ProductController(productService)

    fastify.get('/products', productController.getProducts.bind(productController))
}
