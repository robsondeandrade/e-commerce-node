import { FastifyInstance } from 'fastify'
import { CreateUserController } from '../controllers/CreateUserController'
import { CreateUserService } from '../services/CreateUserService'

export default async (fastify: FastifyInstance) => {
    const createUserService = new CreateUserService()

    const createUserController = new CreateUserController(createUserService)

    fastify.post('/user', createUserController.createUser.bind(createUserController))
}
