import axios from 'axios'
import { env } from '../env'

interface ProductQueryParams {
    search: string
    offset: number
    limit: number
    sort: string
}

class ProductService {
    async fetchProducts({ search, offset, limit, sort }: ProductQueryParams) {
        const baseURL = env.EXTERNAL_SERVICE_URL

        const url = `${baseURL}/search?q=${encodeURIComponent(
            search,
        )}&offset=${offset}&limit=${limit}&sort=${sort}`

        try {
            const response = await axios.get(url)
            return response.data
        } catch (error) {
            throw new Error('Falha ao comunicar com o serviço externo de produtos.')
        }
    }
}

export { ProductService }
