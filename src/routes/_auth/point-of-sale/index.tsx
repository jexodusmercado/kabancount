import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getCategoriesPointOfSaleApi } from '@/services/category'
import {
    PointOfSaleCategoryItemsType,
    PointOfSaleCategoryListType,
} from '@/services/category/schema'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { cartItemsAtom } from '@/store/cart'
import { formatCurrency } from '@/lib/number'

export const Route = createFileRoute('/_auth/point-of-sale/')({
    loader: (opts) =>
        opts.context.queryClient.ensureQueryData(pointOfSaleQueryOptions()),
    component: PointOfSalePage,
})

const pointOfSaleQueryOptions = () =>
    queryOptions({
        queryKey: ['point-of-sale'],
        queryFn: () => getCategoriesPointOfSaleApi(),
    })

const BUCKET_URL = import.meta.env.VITE_BUCKET_URL

function PointOfSalePage() {
    const pointOfSaleQuery = useQuery(pointOfSaleQueryOptions())
    const pointOfSale = pointOfSaleQuery.data

    return (
        <div className="h-full w-full space-y-4">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-2xl">Products</h1>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search"
                        className="max-w-[10rem] md:max-w-sm bg-gray-50"
                    />
                </div>
            </div>
            <ListOfProducts data={pointOfSale} />
        </div>
    )
}

interface ListOfProductsProps {
    data: PointOfSaleCategoryListType | undefined
}

function ListOfProducts(props: ListOfProductsProps) {
    const setCartItems = useSetAtom(cartItemsAtom)

    const handleAddToCart = (value: PointOfSaleCategoryItemsType) => {
        setCartItems((prev) => {
            if (!prev) {
                return [{ ...value, cartQty: 1 }]
            }

            if (value.variantID) {
                const item = prev.find(
                    (item) => item.variantID === value.variantID,
                )
                if (item) {
                    return prev.map((item) => {
                        if (item.variantID === value.variantID) {
                            return { ...item, cartQty: item.cartQty + 1 }
                        }
                        return item
                    })
                }
            } else {
                const item = prev.find((item) => item.ID === value.ID)
                if (item) {
                    return prev.map((item) => {
                        if (item.ID === value.ID) {
                            return { ...item, cartQty: item.cartQty + 1 }
                        }
                        return item
                    })
                }
            }

            return [...prev, { ...value, cartQty: 1 }]
        })
    }

    if (!props.data) {
        return <div>No Products</div>
    }

    return (
        <div className="flex flex-col space-y-4">
            {props.data.map((category, index) => (
                <div key={index} className="space-y-4">
                    <h1 className="text-xl font-extrabold">{category.name}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.items &&
                            category.items.map((item, index) => (
                                <Card
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    <CardHeader className="">
                                        <CardTitle className="text-lg text-center">
                                            {item.productName}
                                        </CardTitle>
                                        <CardDescription>
                                            <div className="flex items-center justify-center space-x-4">
                                                <span className="text-lg">
                                                    {item.variantName
                                                        ? `${item.variantName} - ${item.variantValue}`
                                                        : ''}
                                                </span>
                                                <span className="font-bold text-black text-lg">
                                                    {item.isDiscounted ? (
                                                        <span>
                                                            <span className="line-through text-gray-400">
                                                                P
                                                                {
                                                                    item.originalPrice
                                                                }
                                                            </span>{' '}
                                                            {item.price
                                                                ? formatCurrency(
                                                                      item.price,
                                                                  )
                                                                : ''}
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {item.price
                                                                ? formatCurrency(
                                                                      item.price,
                                                                  )
                                                                : ''}
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
