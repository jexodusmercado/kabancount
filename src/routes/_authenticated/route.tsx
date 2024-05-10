import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { TopBar } from './-components/top-bar'
import { SideBar } from './-components/side-bar'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context, location }) => {
        if (!context.isAuthenticated) {
            throw redirect({
                to: '/',
                search: { redirect: location.href },
            })
        }
    },
    component: Index,
})

function Index() {
    return (
        <>
            <TopBar />
            <SideBar />
            <main className="pt-20 ml-64 px-4">
                <Outlet />
            </main>
        </>
    )
}
