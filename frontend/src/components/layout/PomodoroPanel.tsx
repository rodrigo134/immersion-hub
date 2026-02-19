import { Flame, Pause, Play, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Mode = 'focus' | 'break'

type PomodoroPanelProps = {
  onClose: () => void
}

const FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function PomodoroPanel({ onClose }: PomodoroPanelProps) {
  const [mode, setMode] = useState<Mode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)

  const totalSeconds = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS

  useEffect(() => {
    if (!isRunning) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1

        if (mode === 'focus') {
          setCompletedSessions((count) => count + 1)
          setMode('break')
          setIsRunning(false)
          return BREAK_SECONDS
        }

        setMode('focus')
        setIsRunning(false)
        return FOCUS_SECONDS
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunning, mode])

  const progress = useMemo(() => {
    return (totalSeconds - secondsLeft) / totalSeconds
  }, [secondsLeft, totalSeconds])

  const ring = useMemo(() => {
    const radius = 122
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference * (1 - progress)
    return { radius, circumference, dashOffset }
  }, [progress])

  function switchMode(nextMode: Mode) {
    setMode(nextMode)
    setIsRunning(false)
    setSecondsLeft(nextMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS)
  }

  function resetTimer() {
    setIsRunning(false)
    setSecondsLeft(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS)
  }

  return (
    <div className="w-[320px] overflow-hidden rounded-2xl border border-blue-500/20 bg-[#091636]/95 p-5 shadow-2xl backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-2xl font-extrabold text-white">Timer de Foco</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => switchMode('focus')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            mode === 'focus'
              ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-400/30'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Flame className="size-4" />
          Foco
        </button>

        <button
          onClick={() => switchMode('break')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            mode === 'break'
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-300/30'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Pause className="size-4" />
          Pausa
        </button>
      </div>

      <div className="relative mx-auto mb-5 flex size-[240px] items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 280 280" aria-hidden="true">
          <circle
            cx="140"
            cy="140"
            r={ring.radius}
            fill="none"
            stroke="rgba(148,163,184,0.16)"
            strokeWidth="10"
          />
          <circle
            cx="140"
            cy="140"
            r={ring.radius}
            fill="none"
            stroke={mode === 'focus' ? '#f43f5e' : '#22d3ee'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={ring.circumference}
            strokeDashoffset={ring.dashOffset}
            className="transition-all duration-500"
          />
        </svg>

        <div className="relative z-10 text-center">
          <div className="mb-2 text-lg font-medium uppercase tracking-wide text-slate-300">
            {mode === 'focus' ? 'FOCO' : 'PAUSA'}
          </div>
          <div className="mb-4 text-6xl font-black leading-none text-white">{formatTime(secondsLeft)}</div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsRunning((v) => !v)}
              className="flex size-11 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/35 transition hover:scale-105"
              aria-label={isRunning ? 'Pausar' : 'Iniciar'}
            >
              {isRunning ? <Pause className="size-6" /> : <Play className="size-6" />}
            </button>

            <button
              onClick={resetTimer}
              className="flex size-11 items-center justify-center rounded-full border border-slate-600/70 text-slate-300 transition hover:bg-white/10"
              aria-label="Resetar"
            >
              <RotateCcw className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="mb-2 text-base text-slate-400">Sessoes Completadas</p>
        <div className="mb-3 flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`size-3 rounded-full ${
                dot < Math.min(completedSessions, 4) ? 'bg-blue-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <p className="text-xl text-slate-300">Total: {completedSessions} sessoes</p>
      </div>
    </div>
  )
}


