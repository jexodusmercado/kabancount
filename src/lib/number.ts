export function formatNumber(value: number) {
    return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value)
}

export function formatStringToCurrency(value: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
    }).format(Number(value))
}
