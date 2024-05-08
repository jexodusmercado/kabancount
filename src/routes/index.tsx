import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { SignInSchema, SignInType } from '@/services/endpoints/auth/schema'
import { createFileRoute } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
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

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const signInForm = useForm<SignInType>({
        mode: 'onBlur',
        resolver: zodResolver(SignInSchema),
    })

    const signInMu = useMutation({
        mutationFn: (data: SignInType) => signInApi(data),
        onSuccess: (data) => {
            console.log('success', data)
        },
        onError: (error) => {
            console.log('error', error)
        },
    })

    const onSubmit = (data: SignInType) => {
        signInMu.mutate(data)
    }

    return (
        <div className="bg-gray-200 h-full w-full">
            <div className="h-full flex items-center justify-center">
                <Card className="basis-1/2">
                    <Form {...signInForm}>
                        <form onSubmit={signInForm.handleSubmit(onSubmit)}>
                            <CardHeader className="text-center">
                                <CardTitle>Sign-In</CardTitle>
                                <CardDescription>
                                    Sign in to your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    name="email"
                                    control={signInForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="office@kabancount.io"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={signInForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="********"
                                                />
                                            </FormControl>
                                            <FormMessage />
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
