import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark'
          document.documentElement.className = next
          return { theme: next }
        }),
      setTheme: (theme) => {
        document.documentElement.className = theme
        set({ theme })
      },
    }),
    {
      name: 'trading-bot-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.className = state.theme
        }
      },
    },
  ),
)
