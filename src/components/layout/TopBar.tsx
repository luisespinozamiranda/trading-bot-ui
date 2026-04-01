import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/themeStore'
import { useAppStore } from '@/stores/appStore'
import { useLiveStatus } from '@/api/hooks/useLiveStatus'
import { SYMBOLS } from '@/lib/constants'

export default function TopBar() {
  const { theme, toggleTheme } = useThemeStore()
  const { selectedSymbol, setSelectedSymbol } = useAppStore()
  const { data: liveStatus } = useLiveStatus()

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="flex items-center gap-2">
        {SYMBOLS.map((symbol) => (
          <button
            key={symbol}
            onClick={() => setSelectedSymbol(symbol)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded transition-colors',
              selectedSymbol === symbol
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
            )}
          >
            {symbol.replace('USDT', '')}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              liveStatus?.managerRunning ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-text-muted)]',
            )}
          />
          <span className="text-xs text-[var(--color-text-secondary)]">
            {liveStatus?.managerRunning ? 'Engine Running' : 'Engine Stopped'}
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
