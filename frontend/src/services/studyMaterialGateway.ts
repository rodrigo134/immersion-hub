import type {
  PaginatedStudyMaterials,
  StudyCategoryId,
  StudyDifficulty,
  StudyMaterial,
  StudyMaterialQuery,
} from '../types/study'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()

export interface StudyMaterialGateway {
  listByCategory(
    categoryId: StudyCategoryId,
    query?: StudyMaterialQuery,
  ): Promise<PaginatedStudyMaterials>
}

type SeedTemplate = {
  title: string
  description: string
  difficulty: StudyDifficulty
  durationMinutes: number
  rating: number
}

const templates: Record<StudyCategoryId, SeedTemplate[]> = {
  reading: [
    { title: 'English Short Stories', description: 'Contos para iniciantes', difficulty: 'beginner', durationMinutes: 15, rating: 4.8 },
    { title: 'News Articles', description: 'Artigos de noticias atuais', difficulty: 'intermediate', durationMinutes: 20, rating: 4.7 },
    { title: 'Literature Highlights', description: 'Trechos literarios com vocabulario avancado', difficulty: 'advanced', durationMinutes: 24, rating: 4.9 },
  ],
  speaking: [
    { title: 'Daily Conversation Drills', description: 'Dialogos para pratica diaria', difficulty: 'beginner', durationMinutes: 12, rating: 4.6 },
    { title: 'Pronunciation Workout', description: 'Treino de pronuncia por fonemas', difficulty: 'intermediate', durationMinutes: 18, rating: 4.7 },
    { title: 'Debate Practice', description: 'Topicos para argumentacao fluente', difficulty: 'advanced', durationMinutes: 25, rating: 4.8 },
  ],
  comprehension: [
    { title: 'Podcast Slow English', description: 'Audios com velocidade reduzida', difficulty: 'beginner', durationMinutes: 14, rating: 4.5 },
    { title: 'Interview Clips', description: 'Trechos reais com sotaques variados', difficulty: 'advanced', durationMinutes: 22, rating: 4.8 },
    { title: 'Everyday Audio Scenes', description: 'Dialogos do cotidiano em contexto real', difficulty: 'intermediate', durationMinutes: 17, rating: 4.7 },
  ],
  extension: [
    { title: 'Phrasal Verbs Pack', description: 'Expressoes para comunicacao natural', difficulty: 'intermediate', durationMinutes: 16, rating: 4.7 },
    { title: 'Idioms in Context', description: 'Idiomas aplicados em frases reais', difficulty: 'advanced', durationMinutes: 19, rating: 4.9 },
    { title: 'Collocations Builder', description: 'Combinacoes naturais de palavras', difficulty: 'beginner', durationMinutes: 13, rating: 4.6 },
  ],
}

function buildSeedData(): StudyMaterial[] {
  const all: StudyMaterial[] = []
  const categories = Object.keys(templates) as StudyCategoryId[]

  categories.forEach((categoryId) => {
    for (let i = 1; i <= 24; i += 1) {
      const template = templates[categoryId][(i - 1) % templates[categoryId].length]
      all.push({
        id: `${categoryId}_${i}`,
        categoryId,
        title: `${template.title} ${i}`,
        description: template.description,
        difficulty: template.difficulty,
        durationMinutes: template.durationMinutes + (i % 4),
        rating: Number((template.rating - (i % 3) * 0.1).toFixed(1)),
        url: `https://example.com/${categoryId}/material-${i}`,
      })
    }
  })

  return all
}

const seededMaterials: StudyMaterial[] = buildSeedData()

function sortItems(items: StudyMaterial[], sort: NonNullable<StudyMaterialQuery['sort']>): StudyMaterial[] {
  const copy = items.slice()
  switch (sort) {
    case 'rating_desc':
      return copy.sort((a, b) => b.rating - a.rating)
    case 'rating_asc':
      return copy.sort((a, b) => a.rating - b.rating)
    case 'duration_asc':
      return copy.sort((a, b) => a.durationMinutes - b.durationMinutes)
    case 'duration_desc':
      return copy.sort((a, b) => b.durationMinutes - a.durationMinutes)
    case 'newest':
    default:
      return copy.sort((a, b) => b.id.localeCompare(a.id))
  }
}

function paginate(items: StudyMaterial[], page: number, pageSize: number): PaginatedStudyMaterials {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const end = start + pageSize

  return {
    items: items.slice(start, end),
    total,
    page: safePage,
    pageSize,
    totalPages,
  }
}

class HybridStudyMaterialGateway implements StudyMaterialGateway {
  async listByCategory(
    categoryId: StudyCategoryId,
    query: StudyMaterialQuery = {},
  ): Promise<PaginatedStudyMaterials> {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 8
    const search = query.search?.trim().toLowerCase() ?? ''
    const difficulty = query.difficulty ?? 'all'
    const sort = query.sort ?? 'newest'

    if (API_BASE_URL) {
      try {
        const params = new URLSearchParams({
          category: categoryId,
          page: String(page),
          pageSize: String(pageSize),
          search,
          difficulty,
          sort,
        })

        const response = await fetch(`${API_BASE_URL}/study-materials?${params.toString()}`)
        if (response.ok) {
          const data = (await response.json()) as PaginatedStudyMaterials
          if (data && Array.isArray(data.items)) return data
        }
      } catch {
        // fallback while backend is unavailable
      }
    }

    let items = seededMaterials.filter((item) => item.categoryId === categoryId)

    if (difficulty !== 'all') {
      items = items.filter((item) => item.difficulty === difficulty)
    }

    if (search.length > 0) {
      items = items.filter((item) => {
        const text = `${item.title} ${item.description}`.toLowerCase()
        return text.includes(search)
      })
    }

    items = sortItems(items, sort)
    return paginate(items, page, pageSize)
  }
}

export const studyMaterialGateway: StudyMaterialGateway = new HybridStudyMaterialGateway()
