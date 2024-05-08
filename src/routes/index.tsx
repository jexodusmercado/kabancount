import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { SignInSchema, SignInType } from '@/services/endpoints/auth/schema'
import {
    createFileRoute,
    redirect,
    useNavigate,
    useRouter,
    useSearch,
} from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInApi } from '@/services/endpoints/auth'
import { useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { useAtom } from 'jotai'
import { authAtom } from '@/store/auth'
import { toast } from 'sonner'
import { z } from 'zod'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad: async ({ context }) => {
        if (context.isAuthenticated) {
            throw redirect({
                to: '/dashboard',
            })
        }
    },
    component: Index,
})

const fallback = '/dashboard' as const

function Index() {
    const router = useRouter()
    const navigate = useNavigate()
    const search = Route.useSearch()
    const [auth, setAuth] = useAtom(authAtom)
    const signInForm = useForm<SignInType>({
        mode: 'onBlur',
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const signInMu = useMutation({
        mutationFn: (data: SignInType) => signInApi(data),
        onSuccess: (data) => {
            setAuth({ ...data, isAuthenticated: true })
        },
        onError: () => {
            toast.error('Invalid email or password')
        },
    })

    const onSubmit = (data: SignInType) => {
        signInMu.mutate(data)
    }

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate({
                to: search.redirect || fallback,
                replace: true,
            })
        }
    }, [auth.isAuthenticated, navigate, search.redirect])

    return (
        <div className="bg-gray-200 h-full w-full">
            <div className="h-full flex items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle>Sign-In</CardTitle>
                        <CardDescription>
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>

                    <Form {...signInForm}>
                        <form onSubmit={signInForm.handleSubmit(onSubmit)}>
                            <CardContent>
                                <FormField
                                    name="email"
                                    control={signInForm.control}
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 my-2">
                                            <div className="flex flex-row items-center gap-2">
                                                <FormLabel>Email</FormLabel>
                                                <FormMessage />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="office@kabancount.io"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={signInForm.control}
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 my-2">
                                            <div className="flex flex-row items-center gap-2">
                                                <FormLabel>Password</FormLabel>
                                                <FormMessage />
                                            </div>
                                            <FormControl>
                                                <PasswordInput
                                                    {...field}
                                                    type="password"
                                                    placeholder="********"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Sign In</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    )
}
