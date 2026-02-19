import { BookOpen, Pencil, Plus, Search, Trash2, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Flashcard, FlashcardInput } from '../../types/flashcard'
import FlashcardDialog from './FlashcardDialog'

type FlashcardsManagerProps = {
  cards: Flashcard[]
  onCreate: (input: FlashcardInput) => Promise<void>
  onUpdate: (id: string, input: FlashcardInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onStartReview: (cards: Flashcard[]) => void
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR')
}

export default function FlashcardsManager({
  cards,
  onCreate,
  onUpdate,
  onDelete,
  onStartReview,
}: FlashcardsManagerProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>()

  const categories = useMemo(() => {
    return Array.from(new Set(cards.map((card) => card.category))).sort((a, b) => a.localeCompare(b))
  }, [cards])

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const byCategory = category === 'ALL' || card.category === category
      const text = `${card.front} ${card.back} ${card.category}`.toLowerCase()
      const byQuery = query.trim().length === 0 || text.includes(query.trim().toLowerCase())
      return byCategory && byQuery
    })
  }, [cards, category, query])

  async function handleSubmit(input: FlashcardInput) {
    if (editingCard) {
      await onUpdate(editingCard.id, input)
    } else {
      await onCreate(input)
    }

    setDialogOpen(false)
    setEditingCard(undefined)
  }

  return (
    <section className="relative z-10 min-h-screen px-6 pb-14 pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/45 p-6 backdrop-blur-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-violet-500/20 p-3 text-violet-300">
                <BookOpen className="size-7" />
              </div>
              <div>
                <h2 className="text-5xl font-black text-white">Meus Flashcards</h2>
                <p className="text-slate-400">
                  {cards.length} cards - {categories.length} categorias
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingCard(undefined)
                  setDialogOpen(true)
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-base font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
              >
                <Plus className="size-5" />
                Adicionar Card
              </button>
              <button
                onClick={() => onStartReview(filteredCards)}
                disabled={filteredCards.length === 0}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 px-5 py-3 text-base font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play className="size-5" />
                Revisar ({filteredCards.length})
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_240px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar cards..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/45 py-3 pl-11 pr-4 text-slate-200 outline-none transition focus:border-cyan-400"
              />
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900/45 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400"
            >
              <option value="ALL">Todas as categorias</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <article
              key={card.id}
              className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-5 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-violet-500/25 px-3 py-1 text-xs font-semibold text-violet-200">
                  {card.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCard(card)
                      setDialogOpen(true)
                    }}
                    className="text-cyan-300 transition hover:text-cyan-200"
                    aria-label="Editar card"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => void onDelete(card.id)}
                    className="text-rose-400 transition hover:text-rose-300"
                    aria-label="Excluir card"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Frente:</p>
                  <p className="text-3xl font-bold text-slate-100">{card.front}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Verso:</p>
                  <p className="text-3xl text-slate-200">{card.back}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>{card.language}</span>
                <span>{formatDate(card.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-slate-300">
            Nenhum card encontrado com os filtros atuais.
          </div>
        )}
      </div>

      <FlashcardDialog
        open={dialogOpen}
        card={editingCard}
        onCancel={() => {
          setDialogOpen(false)
          setEditingCard(undefined)
        }}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
