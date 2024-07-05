import axiosInstance from '../axios'
import {
    MutableCategoryType,
    PaginatedCategoriesSchema,
    categorySchema,
    pointOfSaleCategoryListSchema,
} from './schema'

export const getCategoriesApi = async () => {
    const res = await axiosInstance.get('/categories')

    return PaginatedCategoriesSchema.parse(res.data)
}

export const createCategoryApi = async (props: MutableCategoryType) => {
    const res = await axiosInstance.post('/categories', props)

    return categorySchema.parse(res.data)
}

export const getCategoryByIdApi = async (id: string) => {
    const res = await axiosInstance.get(`/categories/${id}`)

    return categorySchema.parse(res.data)
}

export const updateCategoryApi = async (
    id: string,
    props: MutableCategoryType,
) => {
    const res = await axiosInstance.put(`/categories/${id}`, props)

    return categorySchema.parse(res.data)
}

export const getCategoriesPointOfSaleApi = async () => {
    const res = await axiosInstance.get('/categories/pos')

    return pointOfSaleCategoryListSchema.parse(res.data)
}
