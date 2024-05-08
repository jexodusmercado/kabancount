import { AuthType } from '@/store/auth'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'

type ProjectContext = {
    queryClient: QueryClient
    auth: AuthType
    isAuthenticated: boolean
}

export const Route = createRootRouteWithContext<ProjectContext>()({
    component: () => (
        <>
            <Outlet />
            <Toaster position="top-right" richColors />
            <TanStackRouterDevtools />
        </>
    ),
})
