import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function URLtoBlob(url: string) {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'X-Requested-With',
        },
    })
    const blob = await res.blob()

    const file = new File([blob], 'preview', { type: blob.type })

    return file
}
