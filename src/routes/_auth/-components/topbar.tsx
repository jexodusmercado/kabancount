import { cn } from '@/lib/utils'
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from '@headlessui/react'
import { Fragment } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useSetAtom } from 'jotai'
import PersonPlaceholder from '@/assets/images/person-placeholder.png'
import { ChevronDownIcon, MenuIcon } from 'lucide-react'
import { sidebarOpenAtom } from '@/store/sidebar'
import { Button } from '@/components/ui/button'
import { Link, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { authAtom } from '@/store/auth'
import axiosInstance from '@/services/axios'

export function Topbar() {
    const setSideBarOpen = useSetAtom(sidebarOpenAtom)
    const setAuth = useSetAtom(authAtom)
    const router = useRouter()
    const queryClient = useQueryClient()

    const handleLogOut = () => {
        queryClient.clear()
        setAuth({
            expiresAt: 0,
            accessToken: '',
            refreshToken: '',
            isAuthenticated: false,
        })

        axiosInstance.defaults.headers.common['Authorization'] = ''
        axiosInstance.defaults.headers.common['X-Refresh-Token'] = ''

        router.invalidate().finally(() => {
            router.navigate({ to: '/sign-in' })
        })
    }

    const onSideBarOpen = () => {
        setSideBarOpen(true)
    }

    return (
        <nav className="bg-gray-500 border-b fixed w-full z-10">
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex">
                        <div className="flex items-center space-x-2 lg:hidden">
                            <Button variant="ghost" onClick={onSideBarOpen}>
                                <MenuIcon
                                    className="text-white h-6 w-6"
                                    aria-label="Open sidebar"
                                />
                            </Button>
                        </div>
                        <div className="flex flex-1 items-center justify-center lg:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                {/*<img
                                    className="h-8 w-auto"
                                    src={LogoWhite}
                                    alt="S. O. Search Logo"
                                /> */}
                                <span className="font-bold text-white">
                                    KabanCount
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className=" flex items-center justify-center pr-2 sm:static sm:inset-auto  sm:pr-0">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex items-center rounded-full gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <Avatar className="size-6">
                                        <AvatarImage src={PersonPlaceholder} />
                                    </Avatar>
                                    <ChevronDownIcon className="text-white h-6 w-6" />
                                </MenuButton>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <MenuItem>
                                        {({ focus }) => (
                                            <Link
                                                to="/dashboard"
                                                className={cn(
                                                    focus ? 'bg-gray-100' : '',
                                                    'block px-4 py-2 text-sm text-gray-700',
                                                )}
                                            >
                                                Your Profile
                                            </Link>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ focus }) => (
                                            <Button
                                                onClick={handleLogOut}
                                                variant={'ghost'}
                                                className={cn(
                                                    focus ? 'bg-gray-100' : '',
                                                    'block px-4 py-2 text-sm text-left text-gray-700 w-full',
                                                )}
                                            >
                                                Sign out
                                            </Button>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    )
}
