import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '../env'

interface UserCredentials {
    email: string
    password: string
}

const prisma = new PrismaClient()

class LoginUserService {
    async authenticateUser({ email, password }: UserCredentials) {
        const user = await this.findUserByEmail(email)

        await this.validatePassword(password, user?.password ?? '')

        const accessToken = this.generateToken(user?.id)
        const refreshToken = this.generateRefreshToken(user?.id)

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        })

        const { password: _, ...userWithoutPassword } = user
        return { user: userWithoutPassword, accessToken, refreshToken }
    }

    private async findUserByEmail(email: string) {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new Error('Usuário não encontrado ou senha incorreta.')
        return user
    }

    private async validatePassword(password: string, hashedPassword: string) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword)
        if (!isPasswordValid) throw new Error('Senha incorreta.')
    }

    private generateToken(userId: string): string {
        return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '1h' })
    }

    private generateRefreshToken(userId: string): string {
        return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
    }
}

export { LoginUserService }
