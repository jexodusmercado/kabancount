import axiosInstance from '../axios'
import {
    CreateTransactionType,
    PaginatedTransactionSchema,
    transactionSchema,
} from './schema'

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

export const getTransactionByIDApi = async (transactionId: string) => {
    const res = await axiosInstance.get(`/transactions/${transactionId}`)

    try {
        return transactionSchema.parse(res.data)
    } catch (error) {
        console.error('Error fetching transaction', error)
    }
}
