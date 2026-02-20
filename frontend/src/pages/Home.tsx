import { Mic2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import FlashcardsManager from '../components/flashcards/FlashcardsManager'
import FlashcardsReview from '../components/flashcards/FlashcardsReview'
import InspirationScreen from '../components/inspiration/InspirationScreen'
import NavBar from '../components/layout/NavBar'
import StudyAreas from '../components/layout/StudyAreas'
import CategoryMaterialsScreen from '../components/study/CategoryMaterialsScreen'
import StudyTipsScreen from '../components/tips/StudyTipsScreen'
import { flashcardGateway } from '../services/flashcardGateway'
import { studyMaterialGateway } from '../services/studyMaterialGateway'
import type { Flashcard, FlashcardInput } from '../types/flashcard'
import type { StudyCategoryId, StudyCategorySummary, StudyLanguage } from '../types/study'

type Screen =
  | 'home'
  | 'flashcards'
  | 'review'
  | 'category'
  | 'tips'
  | 'inspiration'
  | 'transcription'

function TranscriptionPlaceholder() {
  return (
    <section className="relative z-10 min-h-screen px-6 pb-16 pt-28">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-700/50 bg-slate-900/45 p-8 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
          <Mic2 className="size-7" />
        </div>
        <h1 className="text-4xl font-black text-white">Transcricao</h1>
        <p className="mt-3 text-slate-300">
          Esta area sera conectada em seguida com upload de audio e transcricao automatica.
        </p>
      </div>
    </section>
  )
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([])
  const [selectedCategory, setSelectedCategory] = useState<StudyCategoryId>('')
  const [studyLanguage, setStudyLanguage] = useState<StudyLanguage>('EN')
  const [categories, setCategories] = useState<StudyCategorySummary[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    void loadCards()
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [studyLanguage])

  async function loadCards() {
    const list = await flashcardGateway.list()
    setCards(list)
  }

  async function loadCategories() {
    setLoadingCategories(true)
    try {
      const list = await studyMaterialGateway.listCategories(studyLanguage)
      setCategories(list)

      if (list.length > 0) {
        setSelectedCategory((current) => (current ? current : list[0].id))
      } else {
        setSelectedCategory('')
      }
    } finally {
      setLoadingCategories(false)
    }
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
      onStudyLanguageChange={setStudyLanguage}
    >
      {screen === 'home' && (
        <StudyAreas
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
          categoryId={selectedCategory}
          language={studyLanguage}
          onBack={() => setScreen('home')}
        />
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

      {screen === 'tips' && <StudyTipsScreen />}
      {screen === 'inspiration' && <InspirationScreen />}
      {screen === 'transcription' && <TranscriptionPlaceholder />}
    </NavBar>
  )
}
