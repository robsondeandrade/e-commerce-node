import { FastifyReply, FastifyRequest } from 'fastify'
import { UserLoginSchema } from '../validations/user/UserLoginSchema'
import { LoginUserService } from '../services/LoginUserService'
import { ZodError } from 'zod'

class LoginController {
    loginService: LoginUserService

    constructor(loginService: LoginUserService) {
        this.loginService = loginService
    }

    async login(req: FastifyRequest, reply: FastifyReply) {
        try {
            const validatedData = UserLoginSchema.parse(req.body)
            const user = await this.loginService.authenticateUser(validatedData)

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
            reply
                .status(error.message === 'Usuário não encontrado ou senha incorreta.' ? 401 : 400)
                .send({ message: error.message })
            return
        }
        reply.status(500).send({ message: 'Erro interno do servidor' })
    }
}

export { LoginController }
