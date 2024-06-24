import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { TokenType } from '@/services/auth/schema'

export type AuthStore = TokenType & {
    isAuthenticated: boolean
}

const initialAuthData: AuthStore = {
    accessToken: '',
    expiresAt: 0,
    refreshToken: '',
    isAuthenticated: false,
}

const localJSONStorage = createJSONStorage<AuthStore>()

export const authAtom = atomWithStorage(
    'auth',
    initialAuthData,
    localJSONStorage,
    {
        getOnInit: true,
    },
)
