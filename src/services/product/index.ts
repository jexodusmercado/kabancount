import axiosInstance from '../axios'
import {
    MutableProductType,
    PaginatedProductsSchema,
    ProductSchema,
} from './schema'

export const getProductsApi = async () => {
    const res = await axiosInstance.get('/products')

    const data = PaginatedProductsSchema.parse(res.data)

    return data
}

export const createProductApi = async (props: MutableProductType) => {
    const bodyVariants = props.variants.map((variant) => {
        return {
            variantOptionName: props.variantOptionName,
            ...variant,
        }
    })

    const body = {
        ...props,
        variants: bodyVariants,
    }

    const res = await axiosInstance.post('/products', body)

    return res.data
}

export const updateProductApi = async (
    id: string,
    props: MutableProductType,
) => {
    const { deletedVariantIDs } = props
    const bodyVariants = props.variants.map((variant) => {
        return {
            variantOptionName: props.variantOptionName,
            ...variant,
        }
    })

    const body = {
        ...props,
        variants: bodyVariants,
    }

    const updateRes = await axiosInstance.put(`/products/${id}`, body)

    if (deletedVariantIDs && deletedVariantIDs.length > 0) {
        const deleteRes = await axiosInstance.post(
            `/products/${id}/variants`,
            deletedVariantIDs,
        )

        const asyncUpdate = await Promise.all([updateRes, deleteRes])

        return asyncUpdate[0].data
    }

    return updateRes.data
}

export const getProductByIdApi = async (id: string) => {
    const res = await axiosInstance.get(`/products/${id}`)

    const data = ProductSchema.parse(res.data)

    return data
}

export const addProductsToCategoryApi = async (
    categoryId: string,
    productIds: string[],
) => {
    const res = await axiosInstance.patch(`/category/${categoryId}/add`, {
        productIds,
    })

    return res.data
}

export const removeProductsFromCategoryApi = async (
    categoryId: string,
    productIds: string[],
) => {
    const res = await axiosInstance.patch(`/category/${categoryId}/remove`, {
        data: { productIds },
    })

    return res.data
}
