import { atom } from 'jotai'
import { PointOfSaleCategoryItemsType } from '@/services/category/schema'

export const cartItemsAtom = atom<PointOfSaleCategoryItemsType[]>([])
