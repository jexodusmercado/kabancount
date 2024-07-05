import axiosInstance from '../axios'
import {
    MutableProductType,
    PaginatedProductsSchema,
    ProductSchema,
} from './schema'

export const getProductsApi = async (page: string, pageSize: string) => {
    const res = await axiosInstance.get('/products', {
        params: {
            page,
            pageSize,
        },
    })

    const data = PaginatedProductsSchema.parse(res.data)

    return data
}

export const searchProductByQueryApi = async (query: string) => {
    const res = await axiosInstance.get(
        `/products/search?q=${query}&pageSize=50`,
    )

    return PaginatedProductsSchema.parse(res.data)
}

export const createProductApi = async (props: MutableProductType) => {
    const bodyVariants = props.variants.map((variant) => {
        const combineLatest = {
            variantOptionName: props.variantOptionName,
            ...variant,
        }

        if (variant?.variantMedia) {
            combineLatest.variantMediaID = variant.variantMedia.id
        }

        delete combineLatest.variantMedia

        return combineLatest
    })

    const body = {
        ...props,
        variants: bodyVariants,
    }

    if (props.productMedias) {
        const mediaIDs = props.productMedias.map((media) => media.id)

        body.productMediaID = mediaIDs
        delete body.productMedias
    }

    const res = await axiosInstance.post('/products', body)

    return res.data
}

export const updateProductApi = async (
    id: string,
    props: MutableProductType,
) => {
    const { deletedVariantIDs } = props

    const bodyVariants =
        props.variants.map((variant) => {
            const combineLatest = {
                variantOptionName: props.variantOptionName,
                ...variant,
            }

            if (variant?.variantMedia) {
                console.log('variant.variantMedia', variant.variantMedia.name)
                console.log('variant.variantMedia', variant.variantMedia.id)
                combineLatest.variantMediaID = variant.variantMedia.id
            }

            delete combineLatest.variantMedia

            return combineLatest
        }) || []

    const body = {
        ...props,
        variants: bodyVariants,
    }

    if (props.productMedias) {
        const mediaIDs = props.productMedias.map((media) => media.id)

        body.productMediaID = mediaIDs
        delete body.productMedias
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
