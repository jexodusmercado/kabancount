import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoginSchema, LoginType } from '@/services/auth/schema'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '@/services/auth'
import { authAtom } from '@/store/auth'
import { useSetAtom } from 'jotai'
import { toast } from 'sonner'
import { z } from 'zod'

const fallback = '/dashboard' as const

export const Route = createFileRoute('/sign-in')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({ context, search }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: search.redirect || fallback,
            })
        }
    },
    component: LoginPage,
})

function LoginPage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full px-10 space-y-8 md:max-w-md">
                <h1 className="text-2xl font-bold">KabanCount Log-in</h1>
                <LoginForm />
            </div>
        </div>
    )
}

function LoginForm() {
    const router = useRouter()
    const setAuth = useSetAtom(authAtom)
    const loginMethods = useForm<LoginType>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(LoginSchema),
    })

    const loginMu = useMutation({
        mutationFn: (data: LoginType) => loginApi(data),
        onSuccess: (data) => {
            setAuth({
                ...data,
                isAuthenticated: true,
            })
        },
    })

    const onSubmit = loginMethods.handleSubmit((data) => {
        toast.promise(loginMu.mutateAsync(data), {
            loading: 'Logging in...',
            success: () => {
                setTimeout(() => {
                    router.invalidate()
                }, 1000)
                return 'Logged in!'
            },
            error: 'Failed to login',
        })
    })

    return (
        <Form {...loginMethods}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <FormField
                            name="email"
                            control={loginMethods.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input id="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormField
                            name="password"
                            control={loginMethods.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </div>
            </form>
        </Form>
    )
}
