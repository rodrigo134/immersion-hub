export type LanguageCode = 'EN' | 'ES' | 'FR' | 'DE' | 'PT'

export type FlashcardId = string
export type DeckId = string

export type Deck = {
  id: DeckId
  name: string
  description: string
  language: LanguageCode
  cardCount: number
  createdAt: string
  updatedAt: string
}

export type DeckInput = {
  name: string
  description?: string
  language: LanguageCode
}

export type Flashcard = {
  id: FlashcardId
  deckId: DeckId
  front: string
  back: string
  category: string
  language: LanguageCode
  createdAt: string
  updatedAt: string
}

export type FlashcardInput = {
  deckId?: DeckId
  front: string
  back: string
  category: string
  language: LanguageCode
}

export type FlashcardUpdate = Partial<FlashcardInput>

export type FlashcardFilters = {
  query?: string
  category?: string
  language?: LanguageCode | 'ALL'
}
