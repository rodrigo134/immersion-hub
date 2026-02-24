import { ArrowLeft, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Flashcard } from '../../types/flashcard'
import type { UiLanguage } from '../../types/ui'

type FlashcardsReviewProps = {
  uiLanguage: UiLanguage
  cards: Flashcard[]
  onBack: () => void
}

export default function FlashcardsReview({ uiLanguage, cards, onBack }: FlashcardsReviewProps) {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)

  const current = cards[index]
  const progress = cards.length === 0 ? 0 : ((index + 1) / cards.length) * 100
  const accuracy = useMemo(() => {
    const total = correct + wrong
    if (total === 0) return 0
    return Math.round((correct / total) * 100)
  }, [correct, wrong])

  const copy =
    uiLanguage === 'EN'
      ? {
          noCards: 'No cards to review.',
          backToManage: 'Back to Manage',
          progress: 'Progress',
          clickToSeeFront: 'Click to see front',
          clickToSeeAnswer: 'Click to see answer',
          wrong: 'Wrong',
          correct: 'Correct',
          correctLabel: 'Correct',
          wrongLabel: 'Wrong',
          accuracy: 'Accuracy',
        }
      : {
          noCards: 'Nenhum card para revisar.',
          backToManage: 'Voltar para Gerenciar',
          progress: 'Progresso',
          clickToSeeFront: 'Clique para ver a frente',
          clickToSeeAnswer: 'Clique para ver a resposta',
          wrong: 'Errei',
          correct: 'Acertei',
          correctLabel: 'Corretos',
          wrongLabel: 'Errados',
          accuracy: 'Acuracia',
        }

  if (!current) {
    return (
      <section className="relative z-10 min-h-screen px-6 pb-14 pt-28">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-white backdrop-blur-sm">
          {copy.noCards}
        </div>
      </section>
    )
  }

  function next() {
    if (index >= cards.length - 1) {
      onBack()
      return
    }
    setIndex((curr) => curr + 1)
    setShowAnswer(false)
  }

  function register(result: 'correct' | 'wrong') {
    if (result === 'correct') setCorrect((v) => v + 1)
    if (result === 'wrong') setWrong((v) => v + 1)
    next()
  }

  return (
    <section className="relative z-10 min-h-screen px-6 pb-14 pt-28">
      <div className="pointer-events-none absolute inset-0 bg-slate-950/45" />
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 inline-flex rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 backdrop-blur-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-lg font-semibold text-slate-200 transition hover:text-white"
          >
            <ArrowLeft className="size-5" />
            {copy.backToManage}
          </button>
        </div>

        <div className="mb-2 rounded-xl border border-slate-700/70 bg-slate-900/70 p-3 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
            <span>{copy.progress}</span>
            <span>{index + 1} / {cards.length}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-blue-500 to-fuchsia-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="mt-8 block w-full rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 py-20 text-center text-slate-100 shadow-2xl transition hover:border-cyan-400"
        >
          <p className="mb-4 text-xl uppercase tracking-widest text-cyan-300">{current.category}</p>
          <h2 className="text-7xl font-black leading-none text-white">
            {showAnswer ? current.back : current.front}
          </h2>
          <p className="mt-8 inline-flex items-center gap-2 text-xl text-slate-300">
            <RefreshCcw className="size-5" />
            {showAnswer ? copy.clickToSeeFront : copy.clickToSeeAnswer}
          </p>
        </button>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/65 p-3 backdrop-blur-sm">
          <button
            onClick={() => register('wrong')}
            className="rounded-xl border border-rose-400/40 bg-rose-500/15 px-6 py-3 text-lg font-bold text-rose-300 transition hover:bg-rose-500/25"
          >
            {copy.wrong}
          </button>
          <button
            onClick={() => register('correct')}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-6 py-3 text-lg font-bold text-emerald-300 transition hover:bg-emerald-500/25"
          >
            {copy.correct}
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-12 rounded-2xl border border-slate-700/70 bg-slate-900/65 px-6 py-4 text-center backdrop-blur-sm">
          <div>
            <p className="text-5xl font-black text-emerald-400">{correct}</p>
            <p className="text-slate-300">{copy.correctLabel}</p>
          </div>
          <div>
            <p className="text-5xl font-black text-rose-400">{wrong}</p>
            <p className="text-slate-300">{copy.wrongLabel}</p>
          </div>
          <div>
            <p className="text-5xl font-black text-blue-400">{accuracy}%</p>
            <p className="text-slate-300">{copy.accuracy}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
