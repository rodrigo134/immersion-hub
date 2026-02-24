import type {
  Deck,
  DeckInput,
  Flashcard,
  FlashcardId,
  FlashcardInput,
  FlashcardUpdate,
  LanguageCode,
} from '../types/flashcard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || ''

type DeckResponse = {
  id?: string
  name?: string
  description?: string
  language?: string
  cardCount?: number
  createdAt?: string
  updatedAt?: string
}

type CardResponse = {
  id?: string
  front?: string
  back?: string
  language?: string
  deckId?: string
  context?: string
  difficulty?: number
  interval?: number
  repetitions?: number
  nextReview?: string
  createdAt?: string
  updatedAt?: string
}

type CardDeckMeta = {
  deckId: string
  deckName: string
  deckLanguage: LanguageCode
}

export interface FlashcardGateway {
  listDecks(language?: LanguageCode): Promise<Deck[]>
  createDeck(input: DeckInput): Promise<Deck>
  removeDeck(id: string): Promise<void>
  list(): Promise<Flashcard[]>
  create(input: FlashcardInput): Promise<Flashcard>
  update(id: FlashcardId, update: FlashcardUpdate): Promise<Flashcard>
  remove(id: FlashcardId): Promise<void>
}

function apiUrl(path: string): string {
  if (!API_BASE_URL) return path
  return `${API_BASE_URL}${path}`
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API ${response.status} - ${errorText || response.statusText}`)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

function normalizeLanguage(value: string | null | undefined): LanguageCode {
  const raw = String(value ?? '').toUpperCase()
  if (raw === 'ENGLISH') return 'EN'
  if (raw === 'SPANISH') return 'ES'
  if (raw === 'FRENCH') return 'FR'
  if (raw === 'GERMAN') return 'DE'
  if (raw === 'PORTUGUESE') return 'PT'
  if (raw === 'EN' || raw === 'ES' || raw === 'FR' || raw === 'DE' || raw === 'PT') return raw
  return 'EN'
}

function toApiLanguage(value: LanguageCode): string {
  if (value === 'EN') return 'ENGLISH'
  if (value === 'ES') return 'SPANISH'
  if (value === 'FR') return 'FRENCH'
  if (value === 'DE') return 'GERMAN'
  if (value === 'PT') return 'PORTUGUESE'
  return 'ENGLISH'
}

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  if (value && typeof value === 'object' && Array.isArray((value as { items?: unknown[] }).items)) {
    return (value as { items: T[] }).items
  }
  return []
}

function normalizeDeck(deck: DeckResponse): Deck {
  const createdAt = String(deck.createdAt ?? new Date().toISOString())
  const updatedAt = String(deck.updatedAt ?? createdAt)

  return {
    id: String(deck.id ?? ''),
    name: String(deck.name ?? '').trim(),
    description: String(deck.description ?? ''),
    language: normalizeLanguage(deck.language),
    cardCount: Number(deck.cardCount ?? 0),
    createdAt,
    updatedAt,
  }
}

function mapCardToFlashcard(card: CardResponse, deckMeta: CardDeckMeta): Flashcard {
  const front = String(card.front ?? '').trim()
  const back = String(card.back ?? '').trim()
  const createdAt = String(card.createdAt ?? new Date().toISOString())
  const updatedAt = String(card.updatedAt ?? createdAt)
  const deckId = String(card.deckId ?? deckMeta.deckId)

  return {
    id: String(card.id ?? ''),
    deckId,
    front,
    back,
    category: deckMeta.deckName,
    language: normalizeLanguage(card.language ?? deckMeta.deckLanguage),
    createdAt,
    updatedAt,
  }
}

class ApiFlashcardGateway implements FlashcardGateway {
  private deckMetaByCardId = new Map<FlashcardId, CardDeckMeta>()

  async listDecks(language?: LanguageCode): Promise<Deck[]> {
    const params = new URLSearchParams()
    if (language) params.set('language', toApiLanguage(language))
    const query = params.toString()
    const payload = await requestJson<unknown>(`/api/decks${query ? `?${query}` : ''}`)
    return asArray<DeckResponse>(payload)
      .map(normalizeDeck)
      .filter((deck) => Boolean(deck.id) && Boolean(deck.name))
  }

  async createDeck(input: DeckInput): Promise<Deck> {
    const created = await requestJson<DeckResponse>('/api/decks', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name.trim(),
        description: input.description?.trim() || '',
        language: toApiLanguage(input.language),
      }),
    })
    return normalizeDeck(created)
  }

  async removeDeck(id: string): Promise<void> {
    await requestJson<void>(`/api/decks/${id}`, { method: 'DELETE' })
  }

  private async listCardsByDeck(deckId: string): Promise<CardResponse[]> {
    const params = new URLSearchParams({ deckId })
    const payload = await requestJson<unknown>(`/api/cards?${params.toString()}`)
    return asArray<CardResponse>(payload)
  }

  private async ensureDeckForInput(input: FlashcardInput): Promise<Deck> {
    if (input.deckId) {
      const decks = await this.listDecks()
      const found = decks.find((deck) => deck.id === input.deckId)
      if (found) return found
    }

    const decks = await this.listDecks(input.language)
    const existing = decks.find(
      (deck) =>
        deck.language === input.language &&
        deck.name.trim().toLowerCase() === input.category.trim().toLowerCase(),
    )
    if (existing) return existing

    return await this.createDeck({
      name: input.category.trim(),
      description: `Deck criado automaticamente para a categoria "${input.category.trim()}".`,
      language: input.language,
    })
  }

  private async ensureMetaByCard(id: FlashcardId): Promise<CardDeckMeta> {
    const existing = this.deckMetaByCardId.get(id)
    if (existing) return existing

    const cards = await this.list()
    const found = cards.find((card) => card.id === id)
    if (!found) throw new Error('Card not found')

    const meta = this.deckMetaByCardId.get(id)
    if (!meta) throw new Error('Deck metadata not found for card')
    return meta
  }

  async list(): Promise<Flashcard[]> {
    const decks = await this.listDecks()
    const cardGroups = await Promise.all(decks.map((deck) => this.listCardsByDeck(deck.id)))

    const cards: Flashcard[] = []
    this.deckMetaByCardId.clear()

    decks.forEach((deck, index) => {
      for (const card of cardGroups[index] ?? []) {
        const mapped = mapCardToFlashcard(card, {
          deckId: deck.id,
          deckName: deck.name,
          deckLanguage: deck.language,
        })
        if (!mapped.id) continue
        cards.push(mapped)
        this.deckMetaByCardId.set(mapped.id, {
          deckId: deck.id,
          deckName: deck.name,
          deckLanguage: deck.language,
        })
      }
    })

    return cards.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async create(input: FlashcardInput): Promise<Flashcard> {
    const deck = await this.ensureDeckForInput(input)
    const created = await requestJson<CardResponse>('/api/cards', {
      method: 'POST',
      body: JSON.stringify({
        deckId: deck.id,
        language: toApiLanguage(input.language),
        front: input.front.trim(),
        back: input.back.trim(),
      }),
    })

    const mapped = mapCardToFlashcard(created, {
      deckId: deck.id,
      deckName: deck.name,
      deckLanguage: deck.language,
    })
    this.deckMetaByCardId.set(mapped.id, {
      deckId: deck.id,
      deckName: deck.name,
      deckLanguage: deck.language,
    })
    return mapped
  }

  async update(id: FlashcardId, update: FlashcardUpdate): Promise<Flashcard> {
    const currentMeta = await this.ensureMetaByCard(id)
    const nextDeckId = update.deckId ?? currentMeta.deckId
    const decks = await this.listDecks()
    const nextDeck = decks.find((deck) => deck.id === nextDeckId)

    if (!nextDeck) {
      throw new Error('Deck not found for card update')
    }

    const nextLanguage = update.language ?? nextDeck.language
    const updated = await requestJson<CardResponse>(`/api/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        deckId: nextDeck.id,
        language: toApiLanguage(nextLanguage),
        front: update.front?.trim(),
        back: update.back?.trim(),
      }),
    })

    const mapped = mapCardToFlashcard(updated, {
      deckId: nextDeck.id,
      deckName: nextDeck.name,
      deckLanguage: nextDeck.language,
    })
    this.deckMetaByCardId.set(mapped.id, {
      deckId: nextDeck.id,
      deckName: nextDeck.name,
      deckLanguage: nextDeck.language,
    })
    return mapped
  }

  async remove(id: FlashcardId): Promise<void> {
    await requestJson<void>(`/api/cards/${id}`, { method: 'DELETE' })
    this.deckMetaByCardId.delete(id)
  }
}

export const flashcardGateway: FlashcardGateway = new ApiFlashcardGateway()
