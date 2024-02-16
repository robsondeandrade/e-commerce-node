import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

interface JwtPayloadExtended extends jwt.JwtPayload {
    userId: string
}

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return reply.status(401).send({ error: 'Token não fornecido' })
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayloadExtended

        req.user = decoded
    } catch (error) {
        return reply.status(401).send({ error: 'Token inválido' })
    }
}
