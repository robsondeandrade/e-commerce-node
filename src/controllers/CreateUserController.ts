import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserService } from '../services/CreateUserService'
import { UserRegistrationSchema } from '../validations/user/UserRegistrationSchema'
import { ZodError } from 'zod'

class CreateUserController {
    constructor(private userService: CreateUserService) {}

    async createUser(req: FastifyRequest, reply: FastifyReply) {
        try {
            const validatedData = UserRegistrationSchema.parse(req.body)
            const user = await this.userService.createUser(validatedData)

            reply.send(user)
        } catch (error) {
            this.handleErrors(error, reply)
        }
    }

    private handleErrors(error: unknown, reply: FastifyReply) {
        if (error instanceof ZodError) {
            reply.status(400).send({ errors: error.errors })
            return
        }

        if (error instanceof Error) {
            const status = error.message === 'Já existe um usuário com este e-mail.' ? 409 : 400
            reply.status(status).send({ message: error.message })
            return
        }

        reply.status(500).send({ message: 'Erro interno do servidor' })
    }
}

export { CreateUserController }
