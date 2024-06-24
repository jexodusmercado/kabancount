import { cn } from '@/lib/utils'
import { miniSidebarAtom, sidebarOpenAtom } from '@/store/sidebar'
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react'
import { useAtom } from 'jotai'
import { ChevronLeftIcon, X } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from '@tanstack/react-router'
import { navigation } from './-items'

export function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
    const [miniSidebar, setMiniSidebar] = useAtom(miniSidebarAtom)
    return (
        <>
            <Transition show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <TransitionChild
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex">
                        <TransitionChild
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <TransitionChild
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <X
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                                    <div className="flex h-16 shrink-0 items-center">
                                        {/*<img
                                            className="h-8 w-auto"
                                            src={LogoNormal}
                                            alt="Your Company"
                                        /> */}
                                        <span className="font-bold text-black">
                                            KabanCount
                                        </span>
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul
                                            role="list"
                                            className="flex flex-1 flex-col gap-y-7"
                                        >
                                            <li>
                                                <ul
                                                    role="list"
                                                    className="-mx-2 space-y-1"
                                                >
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            <Link
                                                                to={item.href}
                                                                search={
                                                                    item.searchParam
                                                                }
                                                                onClick={() =>
                                                                    setSidebarOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                activeOptions={{
                                                                    exact: true,
                                                                }}
                                                                activeProps={{
                                                                    className:
                                                                        'bg-gray-300 text-gray-900 hover:text-white hover:bg-slate-100',
                                                                }}
                                                                className={
                                                                    'text-gray-400 hover:text-primary hover:bg-primary/10 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                }
                                                            >
                                                                <item.icon
                                                                    className={cn(
                                                                        'h-6 w-6 shrink-0',
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
            {/* Static sidebar for desktop */}
            <div
                className={cn(
                    'hidden lg:fixed top-16 lg:h-[calc(100%-4rem)] lg:z-10 lg:flex lg:flex-col transition-all duration-500 ease-in-out',
                    miniSidebar
                        ? 'lg:w-20 bg-gradient-to-b'
                        : 'lg:w-48 bg-white',
                )}
            >
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-3">
                    <nav className="flex flex-1 flex-col">
                        <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                        >
                            <li>
                                <ul role="list" className="-mx-2 space-y-2">
                                    <li className="py-4">
                                        <span
                                            onClick={() =>
                                                setMiniSidebar(!miniSidebar)
                                            }
                                            className={cn(
                                                'flex w-full cursor-pointer items-center justify-end',
                                            )}
                                        >
                                            <ChevronLeftIcon
                                                className={cn(
                                                    'text-gray-400 h-6 w-6 shrink-0 transition-transform duration-300 ease-in-out',
                                                    miniSidebar
                                                        ? 'rotate-180'
                                                        : 'rotate-0',
                                                )}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </li>
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.href}
                                                activeOptions={{ exact: true }}
                                                activeProps={{
                                                    className:
                                                        'bg-gray-500  hover:text-primary-foreground',
                                                }}
                                                className={cn(
                                                    'group flex items-center text-black/40 data-[status=active]:text-primary-foreground rounded-md px-2.5 py-2 text-sm font-semibold transition-colors duration-100 ease-linear hover:shadow',
                                                    miniSidebar
                                                        ? 'gap-x-4 hover:text-primary'
                                                        : 'hover:bg-primary-100 gap-x-4',
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        'h-6 w-6 shrink-0 transition-transform duration-300 ease-in-out hover:scale-110',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                <span
                                                    className={cn(
                                                        'opacity-100 transition-opacity duration-700 ease-in-out',
                                                        miniSidebar &&
                                                            'opacity-0',
                                                    )}
                                                >
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}
