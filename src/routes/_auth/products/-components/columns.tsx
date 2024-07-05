import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatToDate } from '@/lib/dayjs'
import { ProductType } from '@/services/product/schema'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon } from 'lucide-react'
import { formatNumber } from '@/lib/number'

export const columns: ColumnDef<ProductType>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => {
            return (
                <Button variant="link" className="p-0 text-blue-900/80">
                    <Link to={`/products/${row.original.id}`}>
                        {row.original.name}
                    </Link>
                </Button>
            )
        },
    },
    {
        accessorKey: 'variants',
        header: '# Variants',
        cell: ({ row }) => row.original.variants?.length || 0,
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const getHighestPrice = (variants: ProductType['variants']) => {
                if (!variants) return 0
                return Math.max(...variants.map((variant) => variant.basePrice))
            }

            const getLowestPrice = (variants: ProductType['variants']) => {
                if (!variants) return 0
                return Math.min(...variants.map((variant) => variant.basePrice))
            }

            if (row.original.variants && row.original.variants.length > 0) {
                const highestPrice = getHighestPrice(row.original.variants)
                const lowestPrice = getLowestPrice(row.original.variants)

                return highestPrice === lowestPrice
                    ? `P${highestPrice}`
                    : `P${lowestPrice} - P${highestPrice}`
            }

            return `P${row.original.basePrice}`
        },
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
            const getStock = (variants: ProductType['variants']) => {
                if (!variants) return 0
                return variants.reduce(
                    (acc, variant) => acc + variant.inventory.quantity,
                    0,
                )
            }

            if (row.original.variants && row.original.variants.length > 0) {
                return formatNumber(getStock(row.original.variants))
            }

            return formatNumber(row.original.inventory.quantity)
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => formatToDate(row.original.createdAt),
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Updated',
        cell: ({ row }) => formatToDate(row.original.updatedAt),
    },
    {
        header: 'Actions',
        cell: ({ row }) => (
            <Link to={`/products/${row.original.id}`}>
                <Button variant="outline">
                    <PencilIcon className="size-4" />
                </Button>
            </Link>
        ),
    },
]
