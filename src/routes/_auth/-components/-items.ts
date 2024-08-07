import {
    HomeIcon,
    LandmarkIcon,
    LucideIcon,
    PackageOpenIcon,
} from 'lucide-react'

export interface NavigationItem {
    name: string
    href: string
    searchParam?: Record<string, unknown>
    icon: LucideIcon
}

export const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    {
        name: 'Products',
        href: '/products',
        icon: PackageOpenIcon,
    },
    {
        name: 'Point-of-Sale',
        href: '/point-of-sale',
        icon: LandmarkIcon,
    },
]
