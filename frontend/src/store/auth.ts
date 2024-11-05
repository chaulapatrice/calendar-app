import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

interface AuthState {
    token: string | null,
    signIn: (token: string | null) => void
    signOut: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            signIn: (token) => {
                set({token})
            },
            signOut: () => {
                localStorage.clear()
                set({token: null})
            }
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useAuthStore