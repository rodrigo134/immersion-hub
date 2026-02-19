import { Brain } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const backgroundImages = [
  'https://images.unsplash.com/photo-1643106036140-06f32ef8fa83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1551778742-5f6acf67d4bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1755617804192-d905ba648ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1606516397986-1eeb79e8c052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1681834418277-b01c30279693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1517935706615-2717063c2225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
]

type NavbarProps = {
  onStart?: () => void
}

export default function Navbar({ onStart }: NavbarProps) {
  const [currentBgIndex] = useState(
    Math.floor(Math.random() * backgroundImages.length),
  )

  return (
    <div className="relative min-h-screen bg-slate-800">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImages[currentBgIndex]}
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/30"></div>
      </div>

      {/* NAVBAR */}
      <div className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
              <Brain className="size-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white">Lingua Hub</div>
              <div className="text-xs text-white/60">Aprenda. Pratique. Domine.</div>
            </div>
          </div>

          <ul className="flex list-none gap-4">
            <li><a href="#" className="text-gray-300 hover:text-white">Inicio</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">FlashCards</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Transcricao</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Dicas</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Inspiracao</a></li>
          </ul>
        </nav>
      </div>

      {/* MAIN */}
      <main className="z-10 flex min-h-screen items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentBgIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden px-6 py-32"
          >
            <div className="relative mx-auto max-w-4xl text-center">
              <h1 className="mb-8 text-6xl font-black leading-tight text-white md:text-7xl">
                Domine Idiomas
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  No Seu Ritmo
                </span>
              </h1>
              <p className="mb-12 text-2xl leading-relaxed text-slate-300">
                Sistema completo de flashcards, transcricao de audio e materiais organizados.
                <br />
                Tudo que voce precisa em um so lugar.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={onStart}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Brain className="mr-2 inline size-6" />
                  Comecar Agora
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  className="rounded-2xl border border-slate-700 bg-slate-800 px-10 py-5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-slate-700"
                >
                  Ver Categorias
                </button>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  )
}