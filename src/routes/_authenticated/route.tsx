import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context, location }) => {
        if (!context.isAuthenticated) {
            throw redirect({
                to: '/',
                search: { redirect: location.href },
            })
        }
    },
    component: () => <Outlet />,
})
