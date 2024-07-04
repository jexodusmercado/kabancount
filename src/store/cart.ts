import { atom } from 'jotai'
import { PointOfSaleCategoryItemsType } from '@/services/category/schema'

export interface CartItemsType extends PointOfSaleCategoryItemsType {
    cartQty: number
}

export const cartItemsAtom = atom<CartItemsType[]>([])
