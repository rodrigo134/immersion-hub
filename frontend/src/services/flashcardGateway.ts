import type {
  Flashcard,
  FlashcardId,
  FlashcardInput,
  FlashcardUpdate,
} from '../types/flashcard'

const STORAGE_KEY = 'linguahub_flashcards_v1'

export interface FlashcardGateway {
  list(): Promise<Flashcard[]>
  create(input: FlashcardInput): Promise<Flashcard>
  update(id: FlashcardId, update: FlashcardUpdate): Promise<Flashcard>
  remove(id: FlashcardId): Promise<void>
}

const seededCards: Flashcard[] = [
  {
    id: 'card_1',
    front: 'Hello',
    back: 'Ola',
    category: 'Greetings',
    language: 'EN',
    createdAt: '2026-02-19T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z',
  },
  {
    id: 'card_2',
    front: 'Thank you',
    back: 'Obrigado',
    category: 'Basic Phrases',
    language: 'EN',
    createdAt: '2026-02-19T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z',
  },
  {
    id: 'card_3',
    front: 'Good morning',
    back: 'Bom dia',
    category: 'Greetings',
    language: 'EN',
    createdAt: '2026-02-19T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z',
  },
]

function nowIso(): string {
  return new Date().toISOString()
}

function createId(): FlashcardId {
  return `card_${crypto.randomUUID()}`
}

function readStorage(): Flashcard[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededCards))
    return seededCards
  }

  try {
    const parsed = JSON.parse(raw) as Flashcard[]
    if (!Array.isArray(parsed)) return seededCards
    return parsed
  } catch {
    return seededCards
  }
}

function writeStorage(cards: Flashcard[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

class LocalFlashcardGateway implements FlashcardGateway {
  async list(): Promise<Flashcard[]> {
    const cards = readStorage().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return cards
  }

  async create(input: FlashcardInput): Promise<Flashcard> {
    const cards = readStorage()
    const timestamp = nowIso()
    const created: Flashcard = {
      id: createId(),
      front: input.front.trim(),
      back: input.back.trim(),
      category: input.category.trim(),
      language: input.language,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    writeStorage([created, ...cards])
    return created
  }

  async update(id: FlashcardId, update: FlashcardUpdate): Promise<Flashcard> {
    const cards = readStorage()
    const target = cards.find((card) => card.id === id)
    if (!target) throw new Error('Flashcard not found')

    const updated: Flashcard = {
      ...target,
      ...update,
      front: (update.front ?? target.front).trim(),
      back: (update.back ?? target.back).trim(),
      category: (update.category ?? target.category).trim(),
      updatedAt: nowIso(),
    }

    const next = cards.map((card) => (card.id === id ? updated : card))
    writeStorage(next)
    return updated
  }

  async remove(id: FlashcardId): Promise<void> {
    const cards = readStorage()
    const next = cards.filter((card) => card.id !== id)
    writeStorage(next)
  }
}

// Replace this export with an API-backed implementation when backend is available.
export const flashcardGateway: FlashcardGateway = new LocalFlashcardGateway()
