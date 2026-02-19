export type StudyCategoryId = 'reading' | 'speaking' | 'comprehension' | 'extension'

export type StudyDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type StudyMaterial = {
  id: string
  categoryId: StudyCategoryId
  title: string
  description: string
  durationMinutes: number
  difficulty: StudyDifficulty
  rating: number
  url: string
}

export type StudyMaterialSort =
  | 'newest'
  | 'rating_desc'
  | 'rating_asc'
  | 'duration_asc'
  | 'duration_desc'

export type StudyMaterialQuery = {
  page?: number
  pageSize?: number
  search?: string
  difficulty?: StudyDifficulty | 'all'
  sort?: StudyMaterialSort
}

export type PaginatedStudyMaterials = {
  items: StudyMaterial[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
