import { DatePicker } from '@/components/ui/date-picker'
import { getTransactionsApi } from '@/services/transaction'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from './-components/data-table'
import { columns } from './-components/column'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/number'
import dayjs from 'dayjs'
import z from 'zod'

const searchParamsSchema = z.object({
    startDate: z
        .string()
        .default(() => dayjs().subtract(1, 'year').toISOString()),
    endDate: z.string().default(() => dayjs().toISOString()),
})

export const Route = createFileRoute('/_auth/dashboard')({
    validateSearch: searchParamsSchema.parse,
    loaderDeps: (opts) => opts.search,
    loader: (opts) =>
        opts.context.queryClient.ensureQueryData(
            transactionsQueryOptions(opts.deps.startDate, opts.deps.endDate),
        ),
    component: Dashboard,
})

const transactionsQueryOptions = (startDate: string, endDate: string) =>
    queryOptions({
        queryKey: ['transactions', startDate, endDate],
        queryFn: () =>
            getTransactionsApi({ startDate, endDate, page: 1, pageSize: 100 }),
    })

function Dashboard() {
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()

    const transactionsQuery = useSuspenseQuery(
        transactionsQueryOptions(searchParams.startDate, searchParams.endDate),
    )

    const transaction = transactionsQuery.data.results

    const handleStartDate = (value: string) => {
        const newDate = dayjs(value).toISOString()
        navigate({
            search: {
                ...searchParams,
                startDate: newDate,
            },
        })
    }

    const handleEndDate = (value: string) => {
        const newDate = dayjs(value).toISOString()
        navigate({
            search: {
                ...searchParams,
                startDate: newDate,
            },
        })
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
                        value={searchParams.startDate}
                    />
                    <DatePicker
                        getValueChange={handleEndDate}
                        value={searchParams.endDate}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-3">
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
