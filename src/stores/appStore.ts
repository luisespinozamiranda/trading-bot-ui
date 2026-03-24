import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  selectedSymbol: string
  sidebarCollapsed: boolean
  setSelectedSymbol: (symbol: string) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedSymbol: 'BTCUSDT',
      sidebarCollapsed: false,
      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    { name: 'trading-bot-app' },
  ),
)
