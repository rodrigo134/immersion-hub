import { useEffect, useState } from 'react'
import FlashcardsManager from '../components/flashcards/FlashcardsManager'
import FlashcardsReview from '../components/flashcards/FlashcardsReview'
import InspirationScreen from '../components/inspiration/InspirationScreen'
import NavBar from '../components/layout/NavBar'
import StudyAreas from '../components/layout/StudyAreas'
import CategoryMaterialsScreen from '../components/study/CategoryMaterialsScreen'
import TranscriptionScreen from '../components/transcription/TranscriptionScreen'
import StudyTipsScreen from '../components/tips/StudyTipsScreen'
import { useAuth } from '../contexts/AuthContext'
import { flashcardGateway } from '../services/flashcardGateway'
import { studyMaterialGateway } from '../services/studyMaterialGateway'
import type { Deck, Flashcard, FlashcardInput, LanguageCode } from '../types/flashcard'
import type { StudyCategoryId, StudyCategorySummary, StudyLanguage } from '../types/study'
import type { UiLanguage } from '../types/ui'

type Screen =
  | 'home'
  | 'flashcards'
  | 'review'
  | 'category'
  | 'tips'
  | 'inspiration'
  | 'transcription'

export default function Home() {
  const { logout } = useAuth()
  const [screen, setScreen] = useState<Screen>('home')
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>('PT')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeckId, setSelectedDeckId] = useState('')
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([])
  const [selectedCategory, setSelectedCategory] = useState<StudyCategoryId>('')
  const [studyLanguage, setStudyLanguage] = useState<StudyLanguage>('EN')
  const [categories, setCategories] = useState<StudyCategorySummary[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  async function loadCards() {
    const list = await flashcardGateway.list()
    setCards(list)
  }

  async function loadDecks() {
    const list = await flashcardGateway.listDecks()
    setDecks(list)
    setSelectedDeckId((current) => (list.some((deck) => deck.id === current) ? current : ''))
    return list
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCards()
      void loadDecks()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    void studyMaterialGateway
      .listCategories(studyLanguage)
      .then((list) => {
        if (!mounted) return
        setCategories(list)
        if (list.length > 0) {
          setSelectedCategory((current) => (current ? current : list[0].id))
        } else {
          setSelectedCategory('')
        }
      })
      .finally(() => {
        if (mounted) setLoadingCategories(false)
      })

    return () => {
      mounted = false
    }
  }, [studyLanguage])

  async function handleCreate(input: FlashcardInput) {
    await flashcardGateway.create(input)
    await loadDecks()
    await loadCards()
  }

  async function handleUpdate(id: string, input: FlashcardInput) {
    await flashcardGateway.update(id, input)
    await loadDecks()
    await loadCards()
  }

  async function handleDelete(id: string) {
    await flashcardGateway.remove(id)
    await loadCards()
  }

  async function handleCreateDeck(input: { name: string; language: LanguageCode }) {
    const created = await flashcardGateway.createDeck({
      name: input.name,
      language: input.language,
      description: '',
    })
    const list = await loadDecks()
    const selectedId =
      created.id ||
      list.find(
        (deck) =>
          deck.name.trim().toLowerCase() === input.name.trim().toLowerCase() &&
          deck.language === input.language,
      )?.id ||
      ''
    setSelectedDeckId(selectedId)
  }

  async function handleDeleteDeck(deckId: string) {
    await flashcardGateway.removeDeck(deckId)
    const list = await loadDecks()
    await loadCards()

    setSelectedDeckId((current) => {
      if (current !== deckId) return current
      return list[0]?.id || ''
    })
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
        if (section === 'tips') setScreen('tips')
        if (section === 'inspiration') setScreen('inspiration')
        if (section === 'transcription') setScreen('transcription')
      }}
      activeSection={
        screen === 'flashcards' || screen === 'review'
          ? 'flashcards'
          : screen === 'tips'
            ? 'tips'
            : screen === 'inspiration'
              ? 'inspiration'
              : screen === 'transcription'
                ? 'transcription'
                : 'home'
      }
      showHero={screen === 'home'}
      studyLanguage={studyLanguage}
      onStudyLanguageChange={(language) => {
        setLoadingCategories(true)
        setStudyLanguage(language)
      }}
      uiLanguage={uiLanguage}
      onUiLanguageChange={setUiLanguage}
      onLogout={logout}
    >
      {screen === 'home' && (
        <StudyAreas
          uiLanguage={uiLanguage}
          categories={categories}
          loading={loadingCategories}
          onSelectCategory={(id) => {
            setSelectedCategory(id)
            setScreen('category')
          }}
        />
      )}

      {screen === 'category' && selectedCategory && (
        <CategoryMaterialsScreen
          uiLanguage={uiLanguage}
          categoryId={selectedCategory}
          language={studyLanguage}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'flashcards' && (
        <FlashcardsManager
          uiLanguage={uiLanguage}
          cards={cards}
          decks={decks}
          selectedDeckId={selectedDeckId}
          onSelectDeck={setSelectedDeckId}
          onCreateDeck={handleCreateDeck}
          onDeleteDeck={handleDeleteDeck}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onStartReview={openReview}
        />
      )}

      {screen === 'review' && (
        <FlashcardsReview
          uiLanguage={uiLanguage}
          cards={reviewCards}
          onBack={() => setScreen('flashcards')}
        />
      )}

      {screen === 'tips' && <StudyTipsScreen uiLanguage={uiLanguage} />}
      {screen === 'inspiration' && <InspirationScreen uiLanguage={uiLanguage} />}
      {screen === 'transcription' && <TranscriptionScreen uiLanguage={uiLanguage} />}
    </NavBar>
  )
}
