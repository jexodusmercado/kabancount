import { ColumnDef } from '@tanstack/react-table'
import { TransactionType } from '@/services/transaction/schema'
import { formatToDate } from '@/lib/dayjs'
import { formatCurrency } from '@/lib/number'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const columns: ColumnDef<TransactionType>[] = [
    {
        accessorKey: 'payment_method',
        header: 'Payment Method',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'total_amount',
        header: 'Total Amount',
        cell: ({ row }) => {
            return <div>{formatCurrency(row.original.total_amount)}</div>
        },
    },
    {
        header: '# Items',
        cell: ({ row }) => {
            return <div>{row.original.transaction_items?.length}</div>
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => {
            return <div>{formatToDate(row.original.createdAt)}</div>
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        cell: ({ row }) => {
            return <div>{formatToDate(row.original.updatedAt)}</div>
        },
    },
    {
        header: 'Action',
        cell: ({ row }) => {
            return (
                <div>
                    <Link to={`/transaction/${row.original.id}`}>
                        <Button> View </Button>
                    </Link>
                </div>
            )
        },
    },
]
