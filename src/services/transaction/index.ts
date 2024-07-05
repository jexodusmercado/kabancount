import axiosInstance from '../axios'
import { CreateTransactionType } from './schema'

export const createTransactionApi = async (props: CreateTransactionType) => {
    const res = await axiosInstance.post('/transactions', props)

    return res.data
}
