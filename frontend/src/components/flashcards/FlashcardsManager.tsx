import {
  ArrowLeft,
  BookOpen,
  FolderOpen,
  Layers3,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Deck, Flashcard, FlashcardInput, LanguageCode } from '../../types/flashcard'
import type { UiLanguage } from '../../types/ui'
import FlashcardDialog from './FlashcardDialog'

type FlashcardsManagerProps = {
  uiLanguage: UiLanguage
  cards: Flashcard[]
  decks: Deck[]
  selectedDeckId: string
  onSelectDeck: (deckId: string) => void
  onCreateDeck: (input: { name: string; language: LanguageCode }) => Promise<void>
  onDeleteDeck: (deckId: string) => Promise<void>
  onCreate: (input: FlashcardInput) => Promise<void>
  onUpdate: (id: string, input: FlashcardInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onStartReview: (cards: Flashcard[]) => void
}

type ViewMode = 'decks' | 'deck-detail'

type ConfirmState =
  | { type: 'deck'; id: string; name: string }
  | { type: 'card'; id: string; name: string }
  | null

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR')
}

export default function FlashcardsManager({
  uiLanguage,
  cards,
  decks,
  selectedDeckId,
  onSelectDeck,
  onCreateDeck,
  onDeleteDeck,
  onCreate,
  onUpdate,
  onDelete,
  onStartReview,
}: FlashcardsManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('decks')
  const [query, setQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>()
  const [newDeckName, setNewDeckName] = useState('')
  const [newDeckLanguage, setNewDeckLanguage] = useState<LanguageCode>('EN')
  const [creatingDeck, setCreatingDeck] = useState(false)
  const [deletingDeckId, setDeletingDeckId] = useState('')
  const [deletingCardId, setDeletingCardId] = useState('')
  const [deckError, setDeckError] = useState('')
  const [confirmState, setConfirmState] = useState<ConfirmState>(null)

  const copy =
    uiLanguage === 'EN'
      ? {
          cards: 'cards',
          deckErrorCreate: 'Failed to create deck.',
          deckErrorDelete: 'Failed to delete deck.',
          decks: 'Decks',
          registeredDecks: 'registered decks',
          newDeckPlaceholder: 'New deck name',
          createDeck: 'Create Deck',
          creating: 'Creating...',
          open: 'Open',
          deleting: 'Deleting...',
          delete: 'Delete',
          noDecks: 'No decks found. Create your first deck above.',
          backToDecks: 'Back to decks',
          cardsInDeck: 'cards in this deck',
          addCard: 'Add Card',
          review: 'Review',
          searchCards: 'Search cards in this deck...',
          front: 'Front',
          back: 'Back',
          editCard: 'Edit card',
          deleteCard: 'Delete card',
          noCards: 'No cards found in this deck.',
          confirmDelete: 'Confirm deletion',
          deleteDeckQuestion: (name: string) => `Do you want to delete the deck "${name}"?`,
          deleteCardQuestion: (name: string) => `Do you want to delete the card "${name}"?`,
          cancel: 'Cancel',
        }
      : {
          cards: 'card(s)',
          deckErrorCreate: 'Falha ao criar deck.',
          deckErrorDelete: 'Falha ao excluir deck.',
          decks: 'Decks',
          registeredDecks: 'decks cadastrados',
          newDeckPlaceholder: 'Nome do novo deck',
          createDeck: 'Criar Deck',
          creating: 'Criando...',
          open: 'Abrir',
          deleting: 'Excluindo...',
          delete: 'Excluir',
          noDecks: 'Nenhum deck encontrado. Crie seu primeiro deck acima.',
          backToDecks: 'Voltar para decks',
          cardsInDeck: 'card(s) neste deck',
          addCard: 'Adicionar Card',
          review: 'Revisar',
          searchCards: 'Buscar cards neste deck...',
          front: 'Frente',
          back: 'Verso',
          editCard: 'Editar card',
          deleteCard: 'Excluir card',
          noCards: 'Nenhum card encontrado neste deck.',
          confirmDelete: 'Confirmar exclusao',
          deleteDeckQuestion: (name: string) => `Deseja excluir o deck "${name}"?`,
          deleteCardQuestion: (name: string) => `Deseja excluir o card "${name}"?`,
          cancel: 'Cancelar',
        }

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) ?? null,
    [decks, selectedDeckId],
  )

  const selectedDeckCards = useMemo(() => {
    if (!selectedDeckId) return []
    return cards
      .filter((card) => card.deckId === selectedDeckId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [cards, selectedDeckId])

  const filteredCards = useMemo(() => {
    return selectedDeckCards.filter((card) => {
      const text = `${card.front} ${card.back}`.toLowerCase()
      return query.trim().length === 0 || text.includes(query.trim().toLowerCase())
    })
  }, [selectedDeckCards, query])

  async function handleSubmit(input: FlashcardInput) {
    if (!selectedDeck) return

    const payload: FlashcardInput = {
      ...input,
      deckId: selectedDeck.id,
      category: selectedDeck.name,
      language: selectedDeck.language,
    }

    if (editingCard) {
      await onUpdate(editingCard.id, payload)
    } else {
      await onCreate(payload)
    }

    setDialogOpen(false)
    setEditingCard(undefined)
  }

  async function handleCreateDeck() {
    if (!newDeckName.trim()) return
    setCreatingDeck(true)
    setDeckError('')
    try {
      await onCreateDeck({ name: newDeckName.trim(), language: newDeckLanguage })
      setNewDeckName('')
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.deckErrorCreate
      setDeckError(message)
    } finally {
      setCreatingDeck(false)
    }
  }

  async function confirmDelete() {
    if (!confirmState) return

    if (confirmState.type === 'deck') {
      setDeletingDeckId(confirmState.id)
      setDeckError('')
      try {
        await onDeleteDeck(confirmState.id)
      } catch (error) {
        const message = error instanceof Error ? error.message : copy.deckErrorDelete
        setDeckError(message)
      } finally {
        setDeletingDeckId('')
        setConfirmState(null)
        if (selectedDeckId === confirmState.id) {
          setViewMode('decks')
        }
      }
      return
    }

    setDeletingCardId(confirmState.id)
    try {
      await onDelete(confirmState.id)
    } finally {
      setDeletingCardId('')
      setConfirmState(null)
    }
  }

  return (
    <section className="relative z-10 min-h-screen px-6 pb-14 pt-28">
      <div className="mx-auto max-w-6xl space-y-6">
        {viewMode === 'decks' && (
          <>
            <div className="rounded-3xl border border-slate-700/50 bg-slate-900/45 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-violet-500/20 p-3 text-violet-300">
                  <BookOpen className="size-7" />
                </div>
                <div>
                  <h2 className="text-5xl font-black text-white">{copy.decks}</h2>
                  <p className="text-slate-400">
                    {decks.length} {copy.registeredDecks}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_180px_150px]">
                <input
                  value={newDeckName}
                  onChange={(event) => setNewDeckName(event.target.value)}
                  placeholder={copy.newDeckPlaceholder}
                  className="rounded-xl border border-slate-700 bg-slate-900/45 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400"
                />
                <select
                  value={newDeckLanguage}
                  onChange={(event) => setNewDeckLanguage(event.target.value as LanguageCode)}
                  className="rounded-xl border border-slate-700 bg-slate-900/45 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400"
                >
                  <option value="EN">EN</option>
                  <option value="ES">ES</option>
                  <option value="FR">FR</option>
                  <option value="DE">DE</option>
                  <option value="PT">PT</option>
                </select>
                <button
                  onClick={() => void handleCreateDeck()}
                  disabled={creatingDeck || !newDeckName.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-base font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Layers3 className="size-5" />
                  {creatingDeck ? copy.creating : copy.createDeck}
                </button>
              </div>
              {deckError && (
                <p className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
                  {deckError}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-700/50 bg-slate-900/45 p-6 backdrop-blur-sm">
              <div className="grid gap-3 md:grid-cols-2">
                {decks.map((deck) => {
                  const count = cards.filter((card) => card.deckId === deck.id).length
                  return (
                    <article key={deck.id} className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black text-white">{deck.name}</h3>
                          <p className="text-sm text-slate-300">
                            {deck.language} - {count} {copy.cards}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectDeck(deck.id)
                              setViewMode('deck-detail')
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700"
                          >
                            <FolderOpen className="size-3.5" />
                            {copy.open}
                          </button>
                          <button
                            onClick={() => setConfirmState({ type: 'deck', id: deck.id, name: deck.name })}
                            disabled={deletingDeckId === deck.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-60"
                          >
                            <Trash2 className="size-3.5" />
                            {deletingDeckId === deck.id ? copy.deleting : copy.delete}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {decks.length === 0 && (
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-slate-300">
                  {copy.noDecks}
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === 'deck-detail' && selectedDeck && (
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900/45 p-6 backdrop-blur-sm">
            <button
              onClick={() => setViewMode('decks')}
              className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-slate-200 hover:bg-slate-700"
            >
              <ArrowLeft className="size-4" />
              {copy.backToDecks}
            </button>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-3xl font-black text-white">{selectedDeck.name}</h3>
                <p className="text-slate-400">
                  {selectedDeckCards.length} {copy.cardsInDeck}
                </p>
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
                  {copy.addCard}
                </button>
                <button
                  onClick={() => onStartReview(filteredCards)}
                  disabled={filteredCards.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 px-5 py-3 text-base font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play className="size-5" />
                  {copy.review} ({filteredCards.length})
                </button>
              </div>
            </div>

            <label className="relative mb-5 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.searchCards}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/45 py-3 pl-11 pr-4 text-slate-200 outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="space-y-3">
              {filteredCards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900/55 p-4 transition hover:border-cyan-400/60"
                >
                  <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">{copy.front}</p>
                      <p className="mt-1 text-lg font-bold text-slate-100">{card.front}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">{copy.back}</p>
                      <p className="mt-1 text-lg text-slate-200">{card.back}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 md:pt-5">
                      <span className="mr-1 text-xs text-slate-500">{formatDate(card.createdAt)}</span>
                      <button
                        onClick={() => {
                          setEditingCard(card)
                          setDialogOpen(true)
                        }}
                        className="text-cyan-300 transition hover:text-cyan-200"
                        aria-label={copy.editCard}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setConfirmState({ type: 'card', id: card.id, name: card.front })}
                        disabled={deletingCardId === card.id}
                        className="text-rose-400 transition hover:text-rose-300 disabled:opacity-60"
                        aria-label={copy.deleteCard}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-900/45 p-6 text-center text-slate-300">
                {copy.noCards}
              </div>
            )}
          </div>
        )}
      </div>

      <FlashcardDialog
        uiLanguage={uiLanguage}
        open={dialogOpen}
        card={editingCard}
        selectedDeckName={selectedDeck?.name ?? ''}
        onCancel={() => {
          setDialogOpen(false)
          setEditingCard(undefined)
        }}
        onSubmit={handleSubmit}
      />

      {confirmState && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <h4 className="text-xl font-black text-white">{copy.confirmDelete}</h4>
            <p className="mt-2 text-slate-300">
              {confirmState.type === 'deck'
                ? copy.deleteDeckQuestion(confirmState.name)
                : copy.deleteCardQuestion(confirmState.name)}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmState(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 py-2 font-semibold text-slate-200 hover:bg-slate-700"
              >
                {copy.cancel}
              </button>
              <button
                onClick={() => void confirmDelete()}
                className="rounded-xl border border-rose-500/40 bg-rose-500/15 py-2 font-semibold text-rose-200 hover:bg-rose-500/25"
              >
                {copy.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
