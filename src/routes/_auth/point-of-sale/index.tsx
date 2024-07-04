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
import {
    CreateTransactionItemType,
    CreateTransactionType,
} from '@/services/transaction/schema'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSetAtom } from 'jotai'
import { cartItemsAtom } from '@/store/cart'

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
        setCartItems((prev) => [...prev, value])
    }

    if (!props.data) {
        return <div>No Products</div>
    }

    return (
        <div className="flex flex-col space-y-4">
            {props.data.map((category, index) => (
                <div key={index} className="space-y-4">
                    <h1>{category.name}</h1>
                    <div className="grid grid-cols-4 gap-4">
                        {category.items &&
                            category.items.map((item, index) => (
                                <Card
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    <CardContent className="pt-4">
                                        <div>
                                            <img
                                                src={
                                                    item.imageURL
                                                        ? `${BUCKET_URL}${item.imageURL}`
                                                        : 'https://via.placeholder.com/150'
                                                }
                                                alt={item.productName}
                                                className="w-full h-40 object-cover object-center rounded-lg"
                                            />
                                        </div>
                                    </CardContent>
                                    <CardHeader className="pt-0">
                                        <CardTitle className="text-lg text-center">
                                            {item.productName}
                                        </CardTitle>
                                        <CardDescription>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg">
                                                    {item.variantName
                                                        ? `${item.variantName} - ${item.variantValue}`
                                                        : ''}
                                                </span>
                                                <span className="font-bold text-black text-lg">
                                                    P{item.price}
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
