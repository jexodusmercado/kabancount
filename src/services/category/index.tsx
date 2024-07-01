import axiosInstance from '../axios'
import { MutableCategoryType } from './schema'

export const getCategoriesApi = async () => {
    const res = await axiosInstance.get('/categories')

    return res.data
}

export const createCategoryApi = async (props: MutableCategoryType) => {
    const res = await axiosInstance.post('/categories', props)

    return res.data
}

export const getCategoryByIdApi = async (id: string) => {
    const res = await axiosInstance.get(`/categories/${id}`)

    return res.data
}

export const updateCategoryApi = async (
    id: string,
    props: MutableCategoryType,
) => {
    const res = await axiosInstance.put(`/categories/${id}`, props)

    return res.data
}
