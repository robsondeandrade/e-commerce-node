import { z } from 'zod'

export const UserRegistrationSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório.'),
    email: z.string().email('Formato de e-mail inválido.').max(255),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').max(20),
})
