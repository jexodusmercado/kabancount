import { useAtomValue } from 'jotai'
import { authAtom, isAuthenticatedAtom } from './store/auth'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/query-client'

const router = createRouter({
    routeTree,
    context: { queryClient, auth: undefined!, isAuthenticated: false },
    defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export const App = () => {
    const auth = useAtomValue(authAtom)
    const isAuthenticated = useAtomValue(isAuthenticatedAtom)

    return (
        <RouterProvider router={router} context={{ auth, isAuthenticated }} />
    )
}
