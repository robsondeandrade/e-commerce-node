import Fastify from 'fastify'
import cors from '@fastify/cors'
import { env } from './env'
import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import favoriteRoutes from './routes/favoriteRoutes'

const app = Fastify({
    logger: true,
})

const start = async () => {
    await app.register(cors)
    app.register(userRoutes)
    app.register(productRoutes)
    app.register(authRoutes)
    app.register(favoriteRoutes)

    try {
        const port = parseInt(env.PORT || '3333', 10)
        const host = env.HOST || '0.0.0.0'

        await app.listen({ port, host })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

process.on('SIGINT', async () => {
    app.log.info('Desligando o servidor...')
    await app.close()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    app.log.info('Desligando o servidor...')
    await app.close()
    process.exit(0)
})

start()
