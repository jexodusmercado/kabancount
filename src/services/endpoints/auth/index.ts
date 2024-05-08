import { axiosInstance } from '@/services'
import { SignInType, TokenSchema } from './schema'

export const signInApi = async (params: SignInType) => {
    const response = await axiosInstance.post('/auth/signin', params)

    const token = TokenSchema.parse(response.data)

    axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${token.token}`
    axiosInstance.defaults.headers.common['X-Refresh-Token'] =
        token.refreshToken

    return token
}
