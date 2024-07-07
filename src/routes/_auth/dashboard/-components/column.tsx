import { ColumnDef } from '@tanstack/react-table'
import { TransactionType } from '@/services/transaction/schema'

export const columns: ColumnDef<TransactionType>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'total_amount',
        header: 'Total Amount',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'payment_method',
        header: 'Payment Method',
    },
    {
        accessorKey: 'transaction_items',
        header: '# Items',
        cell: ({ row }) => row.original.transaction_items.length,
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
    },
    {
        accessorKey: 'updatedAt',
        header: 'Updated At',
    },
]
