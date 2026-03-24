import { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import { useSettings } from '@/api/hooks/useDataStatus'
import { useUpdateSetting } from '@/api/hooks/mutations/useDataMutations'

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const updateMutation = useUpdateSetting()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function startEdit(key: string, value: string) {
    setEditingKey(key)
    setEditValue(value)
  }

  function handleSave(key: string) {
    updateMutation.mutate(
      { key, value: editValue },
      {
        onSuccess: () => {
          toast.success(`Setting "${key}" updated`)
          setEditingKey(null)
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  function handleCancel() {
    setEditingKey(null)
    setEditValue('')
  }

  if (isLoading) return <LoadingSkeleton variant="table" count={10} />

  const grouped = (settings ?? []).reduce<Record<string, typeof settings>>((acc, s) => {
    const cat = s.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat]!.push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Application configuration" />

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden">
          <div className="px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {category}
            </h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {items!.map((s) => (
              <div key={s.key} className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface)] transition-colors">
                <div className="flex-1">
                  <span className="text-sm text-[var(--color-text-primary)]">{s.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  {editingKey === s.key ? (
                    <>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(s.key)
                          if (e.key === 'Escape') handleCancel()
                        }}
                        className="w-48 text-xs font-mono bg-[var(--color-surface)] border border-[var(--color-accent)] text-[var(--color-text-primary)] rounded px-2 py-1 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(s.key)}
                        disabled={updateMutation.isPending}
                        className="p-1 rounded hover:bg-[var(--color-success-muted)] text-[var(--color-success)] transition-colors"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(s.key, s.value)}
                      className="text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] px-2 py-1 rounded hover:bg-[var(--color-accent-muted)] transition-colors"
                    >
                      {s.value}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
