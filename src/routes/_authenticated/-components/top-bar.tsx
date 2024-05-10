import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutApi } from '@/services/endpoints/auth'
import { authAtom } from '@/store/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

export const TopBar = () => {
    const queryClient = useQueryClient()
    const setAuth = useSetAtom(authAtom)
    const router = useRouter()
    const navigate = useNavigate()

    const signOutMu = useMutation({
        mutationFn: () => signOutApi(),
        onSuccess: () => {
            queryClient.clear()
            setAuth(RESET)
        },
        onSettled: () => {
            router.invalidate().then(() => {
                navigate({ to: '/' })
            })
        },
    })

    return (
        <nav className="absolute w-full bg-gray-200 border-b border-black/10 h-16 py-2.5 px-4">
            <ul className="flex gap-2.5 items-center justify-end">
                <li>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src="https://github.com/exo+121223.png" />
                                <AvatarFallback>SM</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => signOutMu.mutate()}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>
            </ul>
        </nav>
    )
}
