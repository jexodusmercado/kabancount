import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, createFileRoute } from '@tanstack/react-router'
import { DataTable } from './-components/data-table'
import { columns } from './-components/columns'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getProductsApi } from '@/services/products'

export const Route = createFileRoute('/_auth/products/')({
    loader: (opts) =>
        opts.context.queryClient.ensureQueryData(productsQueryOptions()),
    component: Products,
})

const productsQueryOptions = () =>
    queryOptions({
        queryKey: ['products'],
        queryFn: () => getProductsApi(),
    })

function Products() {
    const productsQuery = useSuspenseQuery(productsQueryOptions())
    const products = productsQuery.data

    return (
        <div className="h-full w-full space-y-4">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-2xl">Products</h1>
                <Link
                    to="/post/archive"
                    className="text-black/50 hover:text-black"
                >
                    Archives
                </Link>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search"
                        className="max-w-[10rem] md:max-w-sm bg-gray-50"
                    />
                </div>
                <div>
                    <Link to="/products/create">
                        <Button>Create Product</Button>
                    </Link>
                </div>
            </div>
            <div>
                <DataTable columns={columns} data={products.results} />
            </div>
        </div>
    )
}
