export type LanguageCode = 'EN' | 'ES' | 'FR' | 'DE' | 'PT'

export type FlashcardId = string

export type Flashcard = {
  id: FlashcardId
  front: string
  back: string
  category: string
  language: LanguageCode
  createdAt: string
  updatedAt: string
}

export type FlashcardInput = {
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
