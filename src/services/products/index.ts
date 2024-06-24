import axiosInstance from '../axios'
import { MutableProductType, PaginatedProductsSchema } from './schema'

export const getProductsApi = async () => {
    const res = await axiosInstance.get('/products')

    const data = PaginatedProductsSchema.parse(res.data)

    return data
}

export const createProductApi = async (props: MutableProductType) => {
    const res = await axiosInstance.post('/products', props)

    return res.data
}
