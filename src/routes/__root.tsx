import { AuthStore } from '@/store/auth'
import { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'

interface MyRouterContext {
    queryClient: QueryClient
    auth: AuthStore
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => (
        <>
            <Toaster position="top-right" richColors closeButton />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
