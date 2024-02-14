import { z } from 'zod'

export const UserLoginSchema = z.object({
    email: z.string().email('Formato de e-mail inválido.').max(255),
    password: z.string(),
})
