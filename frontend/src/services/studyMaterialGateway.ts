import type {
  PaginatedStudyMaterials,
  StudyCategoryId,
  StudyCategorySummary,
  StudyLanguage,
  StudyMaterial,
  StudyMaterialQuery,
} from '../types/study'
import { authService } from './authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()

type BackendSource = {
  id: string
  name: string
  description: string
  url: string
  category: string
  language: string
}

export interface StudyMaterialGateway {
  listCategories(language: StudyLanguage): Promise<StudyCategorySummary[]>
  listByCategory(
    categoryId: StudyCategoryId,
    query?: StudyMaterialQuery,
  ): Promise<PaginatedStudyMaterials>
}

function normalizeCategory(raw: string | null | undefined): StudyCategoryId {
  const value = String(raw ?? '').trim()
  if (!value) return 'uncategorized'
  return value.toLowerCase()
}

function categoryTitle(categoryId: string): string {
  return categoryId
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function normalizeSource(source: BackendSource): StudyMaterial {
  return {
    id: String(source.id),
    name: String(source.name ?? ''),
    description: String((source as { description?: string }).description ?? ''),
    url: String(source.url ?? '#'),
    category: normalizeCategory(source.category),
    language: String(source.language ?? '-'),
  }
}

function paginate(
  items: StudyMaterial[],
  page: number,
  pageSize: number,
): PaginatedStudyMaterials {
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

function filterAndSearch(
  items: StudyMaterial[],
  categoryId: StudyCategoryId,
  search: string,
): StudyMaterial[] {
  const term = search.trim().toLowerCase()

  return items.filter((item) => {
    if (item.category !== categoryId) return false
    if (!term) return true

    const text = `${item.name} ${item.language}`.toLowerCase()
    return text.includes(term)
  })
}

class ApiStudyMaterialGateway implements StudyMaterialGateway {
  private async fetchSourcesByLanguage(language: StudyLanguage): Promise<StudyMaterial[]> {
    if (!API_BASE_URL) {
      throw new Error('VITE_API_BASE_URL is not configured')
    }

    const params = new URLSearchParams({ language })
    const response = await fetch(`${API_BASE_URL}/api/sources?${params.toString()}`, {
      headers: authService.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to load sources (${response.status})`)
    }

    const payload = await response.json()

    if (Array.isArray(payload)) {
      return payload.map((item) => normalizeSource(item as BackendSource))
    }

    if (payload && Array.isArray(payload.items)) {
      return (payload.items as BackendSource[]).map(normalizeSource)
    }

    throw new Error('Unexpected response format from /api/sources')
  }

  async listCategories(language: StudyLanguage): Promise<StudyCategorySummary[]> {
    const items = await this.fetchSourcesByLanguage(language)

    const map = new Map<StudyCategoryId, number>()
    for (const item of items) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1)
    }

    return Array.from(map.entries())
      .map(([id, count]) => ({ id, count, title: categoryTitle(id) }))
      .sort((a, b) => a.title.localeCompare(b.title))
  }

  async listByCategory(
    categoryId: StudyCategoryId,
    query: StudyMaterialQuery = {},
  ): Promise<PaginatedStudyMaterials> {
    const page = query.page ?? 1
    const pageSize = query.pageSize ?? 8
    const search = query.search?.trim() ?? ''
    const language: StudyLanguage = query.language ?? 'EN'

    const items = await this.fetchSourcesByLanguage(language)
    const filtered = filterAndSearch(items, categoryId, search)
    return paginate(filtered, page, pageSize)
  }
}

export const studyMaterialGateway: StudyMaterialGateway = new ApiStudyMaterialGateway()

