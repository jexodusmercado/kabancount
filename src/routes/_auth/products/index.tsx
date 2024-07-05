import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, createFileRoute } from '@tanstack/react-router'
import { DataTable } from './-components/data-table'
import { columns } from './-components/columns'
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getProductsApi, searchProductByQueryApi } from '@/services/product'
import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { ProductsType } from '@/services/product/schema'

export const Route = createFileRoute('/_auth/products/')({
    loader: (opts) =>
        opts.context.queryClient.ensureQueryData(productsQueryOptions()),
    component: Products,
})

const productsQueryOptions = () =>
    queryOptions({
        queryKey: ['products'],
        queryFn: () => getProductsApi('1', '100'),
    })

function Products() {
    const productsQuery = useSuspenseQuery(productsQueryOptions())
    const products = productsQuery.data
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 500)
    const [data, setData] = useState<ProductsType>([])

    const { data: queryProducts } = useQuery({
        queryKey: ['products', debouncedQuery],
        queryFn: () => searchProductByQueryApi(debouncedQuery),
    })

    useEffect(() => {
        if (debouncedQuery && queryProducts) {
            setData(queryProducts.results)
        } else {
            setData(products.results)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, products, queryProducts])

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
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div>
                    <Link to="/products/create">
                        <Button>Create Product</Button>
                    </Link>
                </div>
            </div>
            <div>
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}
