import { Brain, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { StudyLanguage } from '../../types/study'
import PomodoroPanel from './PomodoroPanel'

const backgroundImages = [
  'https://images.unsplash.com/photo-1643106036140-06f32ef8fa83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1551778742-5f6acf67d4bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1755617804192-d905ba648ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1606516397986-1eeb79e8c052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1681834418277-b01c30279693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
  'https://images.unsplash.com/photo-1517935706615-2717063c2225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
]

type NavSection = 'home' | 'flashcards' | 'transcription' | 'inspiration' | 'tips'

type NavbarProps = {
  onStart?: () => void
  onNavigate?: (section: NavSection) => void
  activeSection?: NavSection
  showHero?: boolean
  children?: ReactNode
  studyLanguage: StudyLanguage
  onStudyLanguageChange: (language: StudyLanguage) => void
}

type Panel = 'studyLang' | 'uiLang' | 'pomodoro' | null

const studyLanguages: StudyLanguage[] = ['EN', 'ES', 'FR', 'DE', 'PT']

export default function Navbar({
  onStart,
  onNavigate,
  activeSection = 'home',
  showHero = true,
  children,
  studyLanguage,
  onStudyLanguageChange,
}: NavbarProps) {
  const [currentBgIndex] = useState(
    Math.floor(Math.random() * backgroundImages.length),
  )
  const [openPanel, setOpenPanel] = useState<Panel>(null)
  const isPomodoroOpen = openPanel === 'pomodoro'

  function togglePanel(panel: Exclude<Panel, null>) {
    setOpenPanel((curr) => (curr === panel ? null : panel))
  }

  function navClass(section: NavSection): string {
    return section === activeSection ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src={backgroundImages[currentBgIndex]}
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>

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
            <li><button onClick={() => onNavigate?.('home')} className={navClass('home')}>Inicio</button></li>
            <li><button onClick={() => onNavigate?.('flashcards')} className={navClass('flashcards')}>Flashcards</button></li>
            <li><button onClick={() => onNavigate?.('transcription')} className={navClass('transcription')}>Transcricao</button></li>
            <li><button onClick={() => onNavigate?.('inspiration')} className={navClass('inspiration')}>Inspiracao</button></li>
            <li><button onClick={() => onNavigate?.('tips')} className={navClass('tips')}>Dicas</button></li>
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => togglePanel('studyLang')}
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Study: {studyLanguage}
            </button>
            <button
              onClick={() => togglePanel('uiLang')}
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              UI
            </button>
            <button
              onClick={() => togglePanel('pomodoro')}
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Focus
            </button>
          </div>
        </nav>

        {openPanel && (
          <button
            aria-label="Fechar painel"
            onClick={() => setOpenPanel(null)}
            className="fixed inset-0 z-40 cursor-default"
          />
        )}

        <AnimatePresence>
          {openPanel === 'studyLang' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed right-6 top-20 z-50 w-72 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="font-bold text-white">Idioma de estudo</div>
                <button
                  onClick={() => setOpenPanel(null)}
                  className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {studyLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onStudyLanguageChange(lang)
                      setOpenPanel(null)
                    }}
                    className={`rounded-xl px-3 py-2 text-sm text-white transition ${studyLanguage === lang ? 'bg-cyan-500/35 ring-1 ring-cyan-400' : 'bg-white/10 hover:bg-white/15'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {openPanel === 'uiLang' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed right-6 top-20 z-50 w-72 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="font-bold text-white">Idioma da interface</div>
                <button
                  onClick={() => setOpenPanel(null)}
                  className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {['PT', 'EN'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setOpenPanel(null)}
                    className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={{
            opacity: isPomodoroOpen ? 1 : 0,
            scale: isPomodoroOpen ? 1 : 0.98,
          }}
          transition={{ duration: 0.12 }}
          className={`fixed right-6 top-20 z-50 origin-top-right ${isPomodoroOpen ? '' : 'pointer-events-none'}`}
        >
          <PomodoroPanel onClose={() => setOpenPanel(null)} />
        </motion.div>
      </div>

      {showHero && (
        <main className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="pointer-events-none absolute inset-0 bg-slate-950/45" />
          <AnimatePresence mode="wait">
            <motion.section
              key={currentBgIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative z-10"
            >
              <div className="relative mx-auto max-w-4xl text-center">
                <h1 className="mb-8 text-6xl font-black leading-tight text-white md:text-7xl">
                  Domine Idiomas
                  <br />
                  <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
      )}

      {children}
    </div>
  )
}
