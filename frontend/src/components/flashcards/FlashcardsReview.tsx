import { ArrowLeft, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Flashcard } from '../../types/flashcard'

type FlashcardsReviewProps = {
  cards: Flashcard[]
  onBack: () => void
}

export default function FlashcardsReview({ cards, onBack }: FlashcardsReviewProps) {
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

  if (!current) {
    return (
      <section className="relative z-10 min-h-screen px-6 pb-14 pt-28">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-white backdrop-blur-sm">
          Nenhum card para revisar.
        </div>
      </section>
    )
  }

  function next() {
    if (index >= cards.length - 1) return
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
      <div className="mx-auto max-w-5xl">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-lg font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="size-5" />
          Voltar para Gerenciar
        </button>

        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
          <span>Progresso</span>
          <span>{index + 1} / {cards.length}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-gradient-to-r from-blue-500 to-fuchsia-500" style={{ width: `${progress}%` }} />
        </div>

        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="mt-8 block w-full rounded-3xl border border-slate-300/50 bg-slate-100 py-20 text-center text-slate-700 shadow-xl transition hover:border-blue-400"
        >
          <p className="mb-4 text-xl uppercase tracking-widest text-slate-500">{current.category}</p>
          <h2 className="text-7xl font-black leading-none text-slate-800">
            {showAnswer ? current.back : current.front}
          </h2>
          <p className="mt-8 inline-flex items-center gap-2 text-xl text-slate-500">
            <RefreshCcw className="size-5" />
            Clique para {showAnswer ? 'ver a frente' : 'ver a resposta'}
          </p>
        </button>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => register('wrong')}
            className="rounded-xl border border-rose-400/40 bg-rose-500/15 px-6 py-3 text-lg font-bold text-rose-300 transition hover:bg-rose-500/25"
          >
            Errei
          </button>
          <button
            onClick={() => register('correct')}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-6 py-3 text-lg font-bold text-emerald-300 transition hover:bg-emerald-500/25"
          >
            Acertei
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-12 text-center">
          <div>
            <p className="text-5xl font-black text-emerald-400">{correct}</p>
            <p className="text-slate-300">Corretos</p>
          </div>
          <div>
            <p className="text-5xl font-black text-rose-400">{wrong}</p>
            <p className="text-slate-300">Errados</p>
          </div>
          <div>
            <p className="text-5xl font-black text-blue-400">{accuracy}%</p>
            <p className="text-slate-300">Acuracia</p>
          </div>
        </div>
      </div>
    </section>
  )
}
