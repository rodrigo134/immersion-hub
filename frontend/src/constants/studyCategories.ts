import { BookOpen, Headphones, Mic, Puzzle, type LucideIcon } from 'lucide-react'
import type { StudyCategoryId } from '../types/study'

export type StudyCategoryMeta = {
  id: StudyCategoryId
  title: string
  subtitle: string
  stats: string
  gradient: string
  icon: LucideIcon
}

export const STUDY_CATEGORIES: StudyCategoryMeta[] = [
  {
    id: 'reading',
    title: 'Reading',
    subtitle: 'Compreensao de textos e vocabulario atraves de leitura.',
    stats: '12 materiais',
    gradient: 'from-blue-500 to-cyan-500',
    icon: BookOpen,
  },
  {
    id: 'speaking',
    title: 'Speaking',
    subtitle: 'Pratique pronuncia e ganhe fluencia em conversacao.',
    stats: '8 exercicios',
    gradient: 'from-emerald-500 to-teal-500',
    icon: Mic,
  },
  {
    id: 'comprehension',
    title: 'Comprehension',
    subtitle: 'Aprimore sua escuta com audios e podcasts nativos.',
    stats: '15 audios',
    gradient: 'from-violet-500 to-fuchsia-500',
    icon: Headphones,
  },
  {
    id: 'extension',
    title: 'Extension',
    subtitle: 'Expanda vocabulario e domine expressoes avancadas.',
    stats: '200+ palavras',
    gradient: 'from-orange-500 to-amber-500',
    icon: Puzzle,
  },
]

export function getCategoryMeta(id: StudyCategoryId): StudyCategoryMeta {
  const found = STUDY_CATEGORIES.find((category) => category.id === id)
  if (!found) {
    throw new Error(`Unknown category: ${id}`)
  }
  return found
}
