import { DatePicker } from '@/components/ui/date-picker'
import { formatDateToRFC1233 } from '@/lib/dayjs'
import { getTransactionsApi } from '@/services/transaction'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DataTable } from './-components/data-table'
import { columns } from './-components/column'

export const Route = createFileRoute('/_auth/dashboard')({
    loader: (opts) => {
        const defaultStart = formatDateToRFC1233('2024-01-01')
        const defaultEnd = formatDateToRFC1233('2024-12-31')
        return opts.context.queryClient.ensureQueryData(
            transactionsQueryOptions(defaultStart, defaultEnd),
        )
    },
    component: Dashboard,
})

const transactionsQueryOptions = (startDate: string, endDate: string) =>
    queryOptions({
        queryKey: ['transactions', startDate, endDate],
        queryFn: () =>
            getTransactionsApi({ startDate, endDate, page: 1, pageSize: 100 }),
    })

function Dashboard() {
    const [startDate, setStartDate] = useState(
        formatDateToRFC1233('2024-01-01'),
    )
    const [endDate, setEndDate] = useState(formatDateToRFC1233('2024-12-31'))
    const transactionsQuery = useSuspenseQuery(
        transactionsQueryOptions(startDate, endDate),
    )

    const transaction = transactionsQuery.data.results

    const handleStartDate = (value: string) => {
        const date = formatDateToRFC1233(value)
        setStartDate(date)
    }

    const handleEndDate = (value: string) => {
        const date = formatDateToRFC1233(value)
        setEndDate(date)
    }

    return (
        <div className="">
            <div className="flex flex-row py-2">
                <h1 className="text-2xl">Dashboard</h1>
            </div>
            <div className="py-4">
                <h1> Transaction </h1>
            </div>
            <div className="space-y-4">
                <div className="flex items-end w-full">
                    <DatePicker
                        getValueChange={handleStartDate}
                        value={startDate}
                    />
                    <DatePicker
                        getValueChange={handleEndDate}
                        value={endDate}
                    />
                </div>
                <DataTable columns={columns} data={transaction} />
            </div>
        </div>
    )
}
