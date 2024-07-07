import axiosInstance from '../axios'
import { CreateTransactionType, PaginatedTransactionSchema } from './schema'

export const createTransactionApi = async (props: CreateTransactionType) => {
    const res = await axiosInstance.post('/transactions', props)

    return res.data
}

export interface TransactionQueryParams {
    startDate: string
    endDate: string
    page: number
    pageSize: number
}

export const getTransactionsApi = async (props: TransactionQueryParams) => {
    const res = await axiosInstance.get('/transactions', {
        params: props,
    })

    return PaginatedTransactionSchema.parse(res.data)
}
