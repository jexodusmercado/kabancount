import { Link } from '@tanstack/react-router'

export const SideBar = () => {
    return (
        <aside className="absolute w-64 bg-gray-200 border-r border-black/10 h-full py-2.5 px-4 mt-16">
            <ul className="flex flex-col gap-2.5 items-start">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/">About</Link>
                </li>
                <li>
                    <Link to="/">Contact</Link>
                </li>
            </ul>
        </aside>
    )
}
