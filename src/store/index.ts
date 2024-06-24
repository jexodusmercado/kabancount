import { createStore } from 'jotai'
import { authAtom } from './auth'

const store = createStore()

store.set(authAtom, (prev) => prev)

export default store
