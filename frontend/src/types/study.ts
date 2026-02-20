export type StudyCategoryId = string

export type StudyLanguage = 'EN' | 'ES' | 'FR' | 'DE' | 'PT'

export type StudyMaterial = {
  id: string
  name: string
  description: string
  url: string
  category: StudyCategoryId
  language: string
}

export type StudyCategorySummary = {
  id: StudyCategoryId
  title: string
  count: number
}

export type StudyMaterialQuery = {
  page?: number
  pageSize?: number
  search?: string
  language?: StudyLanguage
}

export type PaginatedStudyMaterials = {
  items: StudyMaterial[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

