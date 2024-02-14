import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

interface UserRegistrationData {
    name: string
    email: string
    password: string
}

interface UserCreationData {
    name: string
    email: string
    encryptedPassword: string
}

type PrismaUser = UserRegistrationData & { id: string }

const prisma = new PrismaClient()

class CreateUserService {
    async createUser({ name, email, password }: UserRegistrationData) {
        await this.ensureEmailIsUnique(email)

        const encryptedPassword = await this.encryptPassword(password)
        const newUser = await this.createUserInDatabase({
            name,
            email,
            encryptedPassword,
        })

        return this.formatUserResponse(newUser)
    }

    private async ensureEmailIsUnique(email: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            throw new Error('Já existe um usuário com este e-mail.')
        }
    }

    private async encryptPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    private async createUserInDatabase({ name, email, encryptedPassword }: UserCreationData) {
        return prisma.user.create({
            data: { name, email, password: encryptedPassword },
        })
    }

    private formatUserResponse(user: PrismaUser) {
        return { id: user.id, name: user.name, email: user.email }
    }
}

export { CreateUserService }
