import { RouterProvider, createRouter } from '@tanstack/react-router'
import { authAtom } from './store/auth'
import { useAtom } from 'jotai'
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/queryClient'

// Create a new router instance
const router = createRouter({
    routeTree,
    context: { queryClient: queryClient, auth: undefined! },
})

export const InnerApp = () => {
    const [auth] = useAtom(authAtom)
    return <RouterProvider router={router} context={{ auth }} />
}
