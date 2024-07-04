import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useEffect } from 'react'
import { ProductType } from '@/services/product/schema'

interface DataTableProps {
    columns: ColumnDef<ProductType>[]
    data: ProductType[]
    getSelectedIds?: (selectedIds: string[]) => void
}

export function DataTable({ columns, data, getSelectedIds }: DataTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    })

    const rowSelection = table.getState().rowSelection

    useEffect(() => {
        const handleSelectedIds = () => {
            const selectedRows = table
                .getRowModel()
                .rows.filter((row) => row.getIsSelected())

            const selectedIds = selectedRows.map((row) => row.id)

            return selectedIds
        }

        if (getSelectedIds) {
            getSelectedIds(handleSelectedIds())
        }
    }, [table, rowSelection, getSelectedIds])

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
