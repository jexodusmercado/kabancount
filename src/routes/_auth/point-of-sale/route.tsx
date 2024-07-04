import { Outlet, createFileRoute } from '@tanstack/react-router'
import { CartSidebar } from './-components/cart-sidebar'

export const Route = createFileRoute('/_auth/point-of-sale')({
    component: Index,
})

function Index() {
    return (
        <>
            <div className="pr-36 md:pr-96">
                <Outlet />
            </div>
            <CartSidebar />
        </>
    )
}
