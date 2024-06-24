import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard')({
    beforeLoad: () => {
        console.log('dashboard')
    },
    component: Dashboard,
})

function Dashboard() {
    return <div className="">Hello from Dashboard!</div>
}
