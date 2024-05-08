import { TokenType } from '@/services/endpoints/auth/schema'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { atom } from 'jotai/vanilla'

export type AuthType = TokenType & {
    isAuthenticated: boolean
}

const localStorage = createJSONStorage<AuthType>()

const initialAuth: AuthType = {
    accessToken: '',
    expiresAt: 0,
    refreshToken: '',
    isAuthenticated: false,
}

export const authAtom = atomWithStorage<AuthType>(
    'auth',
    initialAuth,
    localStorage,
    { getOnInit: true },
)

export const isAuthenticatedAtom = atom<boolean>(
    (get) => get(authAtom).isAuthenticated,
)
