import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, ExternalLink, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { studyMaterialGateway } from '../../services/studyMaterialGateway'
import type { PaginatedStudyMaterials, StudyCategoryId, StudyLanguage } from '../../types/study'

type CategoryMaterialsScreenProps = {
  categoryId: StudyCategoryId
  language: StudyLanguage
  onBack: () => void
}

const PAGE_SIZE = 8

export default function CategoryMaterialsScreen({ categoryId, language, onBack }: CategoryMaterialsScreenProps) {
  const [pageData, setPageData] = useState<PaginatedStudyMaterials>({
    items: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [categoryId, language, search])

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await studyMaterialGateway.listByCategory(categoryId, {
          page,
          pageSize: PAGE_SIZE,
          search,
          language,
        })

        if (mounted) setPageData(result)
      } catch {
        if (mounted) setError('Falha ao carregar materiais. Tente novamente.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void load()
    return () => {
      mounted = false
    }
  }, [categoryId, language, page, search])

  const categoryTitle = categoryId
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <section className="relative z-10 min-h-screen px-6 pb-14 pt-28">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/65 px-4 py-3 text-lg font-bold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft className="size-5" />
          Voltar
        </button>

        <header className="mb-6">
          <h1 className="text-5xl font-black text-white md:text-6xl">Materiais de {categoryTitle}</h1>
          <p className="mt-2 text-xl text-slate-300">
            {pageData.total} recursos disponiveis para estudo ({language})
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-slate-700/50 bg-slate-900/45 p-4 backdrop-blur-sm">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar material..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/45 py-2.5 pl-10 pr-3 text-slate-200 outline-none transition focus:border-cyan-400"
            />
          </label>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-slate-200 backdrop-blur-sm">
            Carregando materiais...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-8 text-center text-rose-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pageData.items.map((item) => (
                <article
                  key={item.id}
                  className="flex min-h-[220px] flex-col rounded-3xl border border-slate-700/50 bg-slate-900/45 p-5 backdrop-blur-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-300">
                      <BookOpen className="size-6" />
                    </div>
                    <span className="rounded-full border border-blue-500/40 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
                      {item.language || '-'}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-xl font-extrabold text-white">{item.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                    {item.description?.trim() || 'Sem descricao disponivel.'}
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110"
                  >
                    Acessar Material
                    <ExternalLink className="size-4" />
                  </a>
                </article>
              ))}
            </div>

            {pageData.items.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-slate-300 backdrop-blur-sm">
                Nenhum material encontrado.
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/45 px-4 py-3 text-slate-200 backdrop-blur-sm">
              <p>
                Pagina {pageData.page} de {pageData.totalPages} - Mostrando {pageData.items.length} de {pageData.total}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((curr) => Math.max(1, curr - 1))}
                  disabled={pageData.page <= 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-2 text-sm font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </button>
                <button
                  onClick={() => setPage((curr) => Math.min(pageData.totalPages, curr + 1))}
                  disabled={pageData.page >= pageData.totalPages}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-2 text-sm font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Proxima
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
