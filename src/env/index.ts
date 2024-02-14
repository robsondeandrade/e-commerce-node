import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    EXTERNAL_SERVICE_URL: z.string().url(),
    PORT: z.string().optional(),
    HOST: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

let env: Env

try {
    env = envSchema.parse(process.env)
} catch (error) {
    console.error('Falha na validação das variáveis de ambiente:', error)
    process.exit(1)
}

export { env }
