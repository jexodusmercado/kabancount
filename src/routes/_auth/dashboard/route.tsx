import { DatePicker } from '@/components/ui/date-picker'
import { formatDateToRFC1233 } from '@/lib/dayjs'
import { getTransactionsApi } from '@/services/transaction'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DataTable } from './-components/data-table'
import { columns } from './-components/column'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/number'
import dayjs from 'dayjs'

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
        formatDateToRFC1233(dayjs().subtract(1, 'year').toDate()),
    )
    const [endDate, setEndDate] = useState(
        formatDateToRFC1233(dayjs().toDate()),
    )
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
            <Separator />
            <div className="flex flex-row items-center justify-between py-4">
                <div>
                    <h1 className="text-2xl font-bold"> Transaction </h1>
                </div>
                <div className="space-x-2">
                    <span className="text-lg">Filter</span>
                    <DatePicker
                        getValueChange={handleStartDate}
                        value={startDate}
                    />
                    <DatePicker
                        getValueChange={handleEndDate}
                        value={endDate}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-12">
                    <Card className="border col-span-1">
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formatCurrency(
                                transaction.reduce(
                                    (acc, curr) => acc + curr.total_amount,
                                    0,
                                ),
                            )}
                        </CardContent>
                    </Card>
                </div>
                <DataTable columns={columns} data={transaction} />
            </div>
        </div>
    )
}
