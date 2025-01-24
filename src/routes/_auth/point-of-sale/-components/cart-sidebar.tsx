import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/number'
import { createTransactionApi } from '@/services/transaction'
import { CreateTransactionType } from '@/services/transaction/schema'
import { CartItemsType, cartItemsAtom } from '@/store/cart'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { toast } from 'sonner'

const BUCKET_URL = import.meta.env.VITE_BUCKET_URL

export function CartSidebar() {
    const queryClient = useQueryClient()
    const [cartItems, setCartItems] = useAtom(cartItemsAtom)

    const checkoutButton = useMutation({
        mutationFn: async () => {
            const body: CreateTransactionType = {
                type: 'PHYSICAL-STORE',
                status: 'DONE',
                paymentMethod: 'CASH',
                items: cartItems.map((item) => ({
                    productId: item.ID,
                    productVariantId: item.variantID || '',
                    quantity: item.cartQty,
                })),
            }
            createTransactionApi(body)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['products'],
            })
            setCartItems([])
        },
    })

    const handleCheckOut = () => {
        const promisedMu = checkoutButton.mutateAsync()

        toast.promise(promisedMu, {
            loading: 'Processing...',
            success: 'Checkout successful',
            error: 'Checkout failed',
        })
    }

    const handleRemoveItem = (value: CartItemsType) => {
        if (value.variantID) {
            setCartItems((prev) =>
                prev.filter((item) => item.variantID !== value.variantID),
            )
        } else {
            setCartItems((prev) => prev.filter((item) => item.ID !== value.ID))
        }
    }

    const handleSubtractQty = (value: CartItemsType) => {
        if (value.variantID) {
            setCartItems((prev) => {
                const item = prev.find(
                    (item) => item.variantID === value.variantID,
                )

                if (item) {
                    if (item.cartQty <= 1) {
                        return prev.filter(
                            (item) => item.variantID !== value.variantID,
                        )
                    }

                    return prev.map((item) => {
                        if (item.variantID === value.variantID) {
                            return { ...item, cartQty: item.cartQty - 1 }
                        }
                        return item
                    })
                }
                return prev
            })
        } else {
            setCartItems((prev) => {
                const item = prev.find((item) => item.ID === value.ID)
                if (item) {
                    if (item.cartQty <= 1) {
                        return prev.filter(
                            (item) => item.variantID !== value.variantID,
                        )
                    }

                    return prev.map((item) => {
                        if (item.ID === value.ID) {
                            return { ...item, cartQty: item.cartQty - 1 }
                        }
                        return item
                    })
                }
                return prev
            })
        }
    }

    const handleAddQty = (value: CartItemsType) => {
        if (value.quantity <= value.cartQty) {
            toast.error('Cannot add more than available quantity')
            return
        }
        if (value.variantID) {
            setCartItems((prev) => {
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
                return prev
            })
        } else {
            setCartItems((prev) => {
                const item = prev.find((item) => item.ID === value.ID)
                if (item) {
                    return prev.map((item) => {
                        if (item.ID === value.ID) {
                            return { ...item, cartQty: item.cartQty + 1 }
                        }
                        return item
                    })
                }
                return prev
            })
        }
    }

    const calculateTotal = () => {
        let total = 0
        cartItems.forEach((item) => {
            total += item.price * item.cartQty
        })
        return formatCurrency(total)
    }

    return (
        <div className="w-36 md:w-96 fixed top-16 right-0 h-[calc(100%-4rem)] border-l border-gray-200">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">
                        Cart ({cartItems.length})
                    </h1>
                    <button
                        className="text-sm text-blue-500"
                        onClick={() => setCartItems([])}
                    >
                        Clear
                    </button>
                </div>

                <div className="flex flex-col gap-y-3">
                    <div className="flex flex-col  h-96 overflow-auto gap-4">
                        {cartItems.length > 0 &&
                            cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex w-full gap-x-2 items-center"
                                >
                                    <div className="">
                                        <p className="text-lg font-semibold">
                                            {item.productName}
                                        </p>
                                        <p className="text-lg text-gray-500">
                                            {item.variantName
                                                ? item.variantName +
                                                  ' - ' +
                                                  item.variantValue
                                                : ''}
                                        </p>
                                        <p className="text-lg text-gray-500">
                                            {formatCurrency(item.price)}
                                        </p>
                                        <p className="text-lg text-gray-500">
                                            Quantity: {item.cartQty}
                                        </p>

                                        <div className="flex gap-x-2 items-center">
                                            <button
                                                className="text-xs text-blue-500"
                                                onClick={() =>
                                                    handleSubtractQty(item)
                                                }
                                            >
                                                -
                                            </button>
                                            <button
                                                className="text-xs text-blue-500"
                                                onClick={() =>
                                                    handleAddQty(item)
                                                }
                                            >
                                                +
                                            </button>
                                            <button
                                                className="text-xs text-red-500"
                                                onClick={() =>
                                                    handleRemoveItem(item)
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">Total</p>
                        <p className="text-sm font-semibold">
                            {calculateTotal()}
                        </p>
                    </div>
                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button">Checkout</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCheckOut}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>
    )
}
