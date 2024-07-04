import axiosInstance from '../axios'
import { CreateMediaType, paginatedMediaSchema, mediasSchema } from './schema'

export const getMediaApi = async (page: number, pageSize: number) => {
    const response = await axiosInstance.get(
        `/media?page=${page}&pageSize=${pageSize}`,
    )

    return paginatedMediaSchema.parse(response.data)
}

export const createMediaApi = async (props: CreateMediaType) => {
    const formData = new FormData()

    props.images.forEach((image) => {
        formData.append('images[]', image)
    })

    const response = await axiosInstance.post('/media', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    return mediasSchema.parse(response.data)
}

export const getMediaByProductIdApi = async (productId: string) => {
    const response = await axiosInstance.get(`/media/product/${productId}`)

    return paginatedMediaSchema.parse(response.data)
}
