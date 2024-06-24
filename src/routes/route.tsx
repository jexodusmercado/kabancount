import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            return redirect({
                to: '/dashboard',
            })
        }

        if (!context.auth.isAuthenticated) {
            return redirect({
                to: '/sign-in',
            })
        }
    },
    component: () => <Outlet />,
})
