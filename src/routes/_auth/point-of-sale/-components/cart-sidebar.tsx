import { cartItemsAtom } from '@/store/cart'
import { useAtom } from 'jotai'

const BUCKET_URL = import.meta.env.VITE_BUCKET_URL

export function CartSidebar() {
    const [cartItems, setCartItems] = useAtom(cartItemsAtom)
    return (
        <div className="w-24 md:w-96 fixed top-16 right-0 h-[calc(100%-4rem)] border-l border-gray-200">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">
                        Cart ({cartItems.length})
                    </h1>
                    <button className="text-sm text-blue-500">Clear</button>
                </div>

                <div className="flex flex-col gap-y-3">
                    <div className="flex justify-between items-center h-1/2 overflow-auto">
                        {cartItems.length &&
                            cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex w-full gap-x-2 items-center"
                                >
                                    <img
                                        src={
                                            item.imageURL
                                                ? `${BUCKET_URL}${item.imageURL}`
                                                : 'https://via.placeholder.com/150'
                                        }
                                        alt={item.productName}
                                        className="w-40 h-32 object-cover object-center rounded-lg"
                                    />
                                    <div className="">
                                        <p className="text-sm font-semibold">
                                            {item.productName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.variantName
                                                ? item.variantName +
                                                  ' - ' +
                                                  item.variantValue
                                                : ''}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            P{item.price}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>

                                        <div className="flex gap-x-1 items-center">
                                            <button className="text-xs text-blue-500">
                                                Edit
                                            </button>
                                            <button className="text-xs text-red-500">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
