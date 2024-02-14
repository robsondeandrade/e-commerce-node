import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { env } from '../env'

interface JwtPayloadWithUserId extends jwt.JwtPayload {
    userId: string
}

const prisma = new PrismaClient()

class RefreshTokenService {
    async generateAccessTokenFromRefreshToken(refreshToken: string) {
        if (!refreshToken) throw new Error('Refresh token é necessário.')

        let userId

        try {
            const payload = jwt.verify(
                refreshToken,
                env.JWT_REFRESH_SECRET!,
            ) as JwtPayloadWithUserId

            userId = payload.userId
        } catch (error) {
            throw new Error('Refresh token inválido.')
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        })

        if (!storedToken || storedToken.expiry < new Date()) {
            throw new Error('Refresh token expirado ou não encontrado.')
        }

        const newAccessToken = this.generateAccessToken(userId)
        return newAccessToken
    }

    private generateAccessToken(userId: string): string {
        return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '1h' })
    }
}

export { RefreshTokenService }
