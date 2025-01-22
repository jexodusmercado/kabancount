import axiosInstance from '../axios'
import { TokenSchema, LoginType } from './schema'

export const loginApi = async (props: LoginType) => {
    const res = await axiosInstance.post('/auth/sign-in', props)

    const data = TokenSchema.parse(res.data)
    axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${data.accessToken}`
    axiosInstance.defaults.headers.common['X-Refresh-Token'] = data.refreshToken

    return data
}

export const logoutApi = async () => {
    const res = await axiosInstance.post('/auth/logout')

    return res.data
}
