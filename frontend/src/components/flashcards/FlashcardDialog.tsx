import { X, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Flashcard, FlashcardInput, LanguageCode } from '../../types/flashcard'

type FlashcardDialogProps = {
  open: boolean
  card?: Flashcard
  onCancel: () => void
  onSubmit: (input: FlashcardInput) => Promise<void>
}

type FormState = FlashcardInput

const initialForm: FormState = {
  front: '',
  back: '',
  category: '',
  language: 'EN',
}

export default function FlashcardDialog({ open, card, onCancel, onSubmit }: FlashcardDialogProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (!card) {
      setForm(initialForm)
      return
    }

    setForm({
      front: card.front,
      back: card.back,
      category: card.category,
      language: card.language,
    })
  }, [open, card])

  if (!open) return null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.front.trim() || !form.back.trim() || !form.category.trim()) return

    setSaving(true)
    try {
      await onSubmit(form)
    } finally {
      setSaving(false)
    }
  }

  function setLanguage(language: LanguageCode) {
    setForm((curr) => ({ ...curr, language }))
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-3xl border border-slate-300/30 bg-slate-100 p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-4xl font-black text-slate-800">{card ? 'Editar Card' : 'Novo Card'}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Frente do Card *</span>
            <input
              value={form.front}
              onChange={(e) => setForm((curr) => ({ ...curr, front: e.target.value }))}
              placeholder="Ex: Hello"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Verso do Card *</span>
            <input
              value={form.back}
              onChange={(e) => setForm((curr) => ({ ...curr, back: e.target.value }))}
              placeholder="Ex: Ola"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Categoria *</span>
            <input
              value={form.category}
              onChange={(e) => setForm((curr) => ({ ...curr, category: e.target.value }))}
              placeholder="Ex: Greetings"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Idioma</span>
            <select
              value={form.language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="EN">Ingles</option>
              <option value="ES">Espanhol</option>
              <option value="FR">Frances</option>
              <option value="DE">Alemao</option>
              <option value="PT">Portugues</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 bg-slate-200 py-3 font-bold text-slate-700 transition hover:bg-slate-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-500 py-3 font-bold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="size-4" />
            {saving ? 'Salvando...' : card ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  )
}
