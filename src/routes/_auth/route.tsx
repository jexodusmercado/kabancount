import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Sidebar } from './-components/sidebar'
import { Topbar } from './-components/topbar'
import { useAtomValue } from 'jotai'
import { miniSidebarAtom } from '@/store/sidebar'
import { cn } from '@/lib/utils'
import axiosInstance from '@/services/axios'

export const Route = createFileRoute('/_auth')({
    beforeLoad: ({ context }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/sign-in',
            })
        }

        axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${context.auth.accessToken}`
        axiosInstance.defaults.headers.common['X-Refresh-Token'] =
            context.auth.refreshToken
    },
    component: Index,
})

function Index() {
    const miniSidebar = useAtomValue(miniSidebarAtom)
    return (
        <>
            <Topbar />
            <Sidebar />
            <main
                className={cn(
                    'pt-20 px-8 lg:pr-8 w-full h-full transition-all duration-500 ease-in-out',
                    miniSidebar ? 'lg:pl-24' : 'lg:pl-52',
                )}
            >
                <Outlet />
            </main>
        </>
    )
}
