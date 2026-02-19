import { useEffect, useState } from 'react'
import FlashcardsManager from '../components/flashcards/FlashcardsManager'
import FlashcardsReview from '../components/flashcards/FlashcardsReview'
import NavBar from '../components/layout/NavBar'
import StudyAreas from '../components/layout/StudyAreas'
import { flashcardGateway } from '../services/flashcardGateway'
import type { Flashcard, FlashcardInput } from '../types/flashcard'

type Screen = 'home' | 'flashcards' | 'review'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([])

  useEffect(() => {
    void loadCards()
  }, [])

  async function loadCards() {
    const list = await flashcardGateway.list()
    setCards(list)
  }

  async function handleCreate(input: FlashcardInput) {
    await flashcardGateway.create(input)
    await loadCards()
  }

  async function handleUpdate(id: string, input: FlashcardInput) {
    await flashcardGateway.update(id, input)
    await loadCards()
  }

  async function handleDelete(id: string) {
    await flashcardGateway.remove(id)
    await loadCards()
  }

  function openReview(selected: Flashcard[]) {
    if (selected.length === 0) return
    setReviewCards(selected)
    setScreen('review')
  }

  return (
    <NavBar
      onStart={() => setScreen('flashcards')}
      onNavigate={(section) => {
        if (section === 'home') setScreen('home')
        if (section === 'flashcards') setScreen('flashcards')
      }}
      activeSection={screen === 'home' ? 'home' : 'flashcards'}
      showHero={screen === 'home'}
    >
      {screen === 'home' && (
        <StudyAreas onSelectCategory={() => setScreen('flashcards')} />
      )}

      {screen === 'flashcards' && (
        <FlashcardsManager
          cards={cards}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onStartReview={openReview}
        />
      )}

      {screen === 'review' && (
        <FlashcardsReview cards={reviewCards} onBack={() => setScreen('flashcards')} />
      )}
    </NavBar>
  )
}
