import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  FlaskConical,
  Activity,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/appStore'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chart', icon: BarChart3, label: 'Chart' },
  { to: '/strategies', icon: Brain, label: 'Strategies' },
  { to: '/backtest', icon: FlaskConical, label: 'Backtest Lab' },
  { to: '/live', icon: Activity, label: 'Live Trading' },
  { to: '/data', icon: Database, label: 'Data' },
  { to: '/settings', icon: Settings, label: 'Settings' },
] as const

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-56',
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">
            Trading Bot
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                isActive
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent-muted)] border-r-2 border-[var(--color-accent)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
                sidebarCollapsed && 'justify-center px-0',
              )
            }
          >
            <Icon size={18} />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
