import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, ExternalLink, Search, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { studyMaterialGateway } from '../../services/studyMaterialGateway'
import type { PaginatedStudyMaterials, StudyCategoryId, StudyLanguage, StudyMaterial } from '../../types/study'
import type { UiLanguage } from '../../types/ui'

type CategoryMaterialsScreenProps = {
  uiLanguage: UiLanguage
  categoryId: StudyCategoryId
  language: StudyLanguage
  onBack: () => void
}

const PAGE_SIZE = 8
const CARD_TINTS = [
  {
    default:
      'border-cyan-400/18 bg-[linear-gradient(180deg,rgba(8,47,73,0.78),rgba(15,23,42,0.64))] hover:border-cyan-300/40',
    favorite:
      'border-cyan-300/35 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(180deg,rgba(8,47,73,0.86),rgba(15,23,42,0.68))]',
    topLine: 'via-cyan-300/70',
    badge: 'border-cyan-300/30 bg-cyan-400/10 text-cyan-100',
    icon: 'bg-cyan-500/15 text-cyan-300 shadow-cyan-400/10',
    favoriteButton:
      'border-cyan-300/50 bg-cyan-400/12 text-cyan-100',
    favoriteHover:
      'hover:border-cyan-300/40 hover:text-cyan-100',
  },
  {
    default:
      'border-sky-400/18 bg-[linear-gradient(180deg,rgba(30,41,59,0.8),rgba(15,23,42,0.64))] hover:border-sky-300/40',
    favorite:
      'border-sky-300/35 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.15),transparent_28%),linear-gradient(180deg,rgba(30,41,59,0.88),rgba(15,23,42,0.68))]',
    topLine: 'via-sky-300/70',
    badge: 'border-sky-300/30 bg-sky-400/10 text-sky-100',
    icon: 'bg-sky-500/15 text-sky-300 shadow-sky-400/10',
    favoriteButton:
      'border-sky-300/50 bg-sky-400/12 text-sky-100',
    favoriteHover:
      'hover:border-sky-300/40 hover:text-sky-100',
  },
  {
    default:
      'border-indigo-400/18 bg-[linear-gradient(180deg,rgba(30,27,75,0.8),rgba(15,23,42,0.66))] hover:border-indigo-300/40',
    favorite:
      'border-indigo-300/35 bg-[radial-gradient(circle_at_top_left,rgba(165,180,252,0.16),transparent_28%),linear-gradient(180deg,rgba(30,27,75,0.88),rgba(15,23,42,0.68))]',
    topLine: 'via-indigo-300/70',
    badge: 'border-indigo-300/30 bg-indigo-400/10 text-indigo-100',
    icon: 'bg-indigo-500/15 text-indigo-300 shadow-indigo-400/10',
    favoriteButton:
      'border-indigo-300/50 bg-indigo-400/12 text-indigo-100',
    favoriteHover:
      'hover:border-indigo-300/40 hover:text-indigo-100',
  },
]

export default function CategoryMaterialsScreen({
  uiLanguage,
  categoryId,
  language,
  onBack,
}: CategoryMaterialsScreenProps) {
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
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [pendingFavoriteId, setPendingFavoriteId] = useState<string | null>(null)

  const copy =
    uiLanguage === 'EN'
      ? {
          loadError: 'Failed to load materials. Please try again.',
          back: 'Back',
          materialsOf: 'Materials for',
          resources: 'resources available for study',
          searchPlaceholder: 'Search material...',
          favoritesOnly: 'Only favorites',
          favorites: 'favorites',
          favorite: 'Favorite',
          unfavorite: 'Remove favorite',
          loading: 'Loading materials...',
          noDescription: 'No description available.',
          openMaterial: 'Open Material',
          noResults: 'No materials found.',
          page: 'Page',
          of: 'of',
          showing: 'Showing',
          previous: 'Previous',
          next: 'Next',
        }
      : {
          loadError: 'Falha ao carregar materiais. Tente novamente.',
          back: 'Voltar',
          materialsOf: 'Materiais de',
          resources: 'recursos disponiveis para estudo',
          searchPlaceholder: 'Buscar material...',
          favoritesOnly: 'So favoritos',
          favorites: 'favoritos',
          favorite: 'Favoritar',
          unfavorite: 'Remover favorito',
          loading: 'Carregando materiais...',
          noDescription: 'Sem descricao disponivel.',
          openMaterial: 'Acessar Material',
          noResults: 'Nenhum material encontrado.',
          page: 'Pagina',
          of: 'de',
          showing: 'Mostrando',
          previous: 'Anterior',
          next: 'Proxima',
        }

  useEffect(() => {
    setPage(1)
  }, [categoryId, language, search, favoritesOnly])

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
          favoritesOnly,
        })

        if (mounted) setPageData(result)
      } catch {
        if (mounted) setError(copy.loadError)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void load()
    return () => {
      mounted = false
    }
  }, [categoryId, language, page, search, favoritesOnly, copy.loadError])

  async function handleFavoriteToggle(item: StudyMaterial) {
    const nextFavorite = !item.favorite

    setPendingFavoriteId(item.id)
    setPageData((current) => ({
      ...current,
      items: current.items.map((entry) =>
        entry.id === item.id ? { ...entry, favorite: nextFavorite } : entry,
      ),
    }))

    try {
      if (nextFavorite) {
        await studyMaterialGateway.favorite(item.id)
      } else {
        await studyMaterialGateway.unfavorite(item.id)
      }

      const refreshed = await studyMaterialGateway.listByCategory(categoryId, {
        page,
        pageSize: PAGE_SIZE,
        search,
        language,
        favoritesOnly,
      })

      setPageData(refreshed)
    } catch {
      setPageData((current) => ({
        ...current,
        items: current.items.map((entry) =>
          entry.id === item.id ? { ...entry, favorite: item.favorite } : entry,
        ),
      }))
      setError(copy.loadError)
    } finally {
      setPendingFavoriteId(null)
    }
  }

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
          {copy.back}
        </button>

        <header className="mb-6 overflow-hidden rounded-[2rem] border border-slate-700/60 bg-[linear-gradient(145deg,rgba(2,6,23,0.88),rgba(15,23,42,0.76))] shadow-[0_24px_70px_rgba(2,6,23,0.32)] backdrop-blur-md">
          <div className="relative p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_right,rgba(59,130,246,0.12),transparent_26%)]" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-100">
                <BookOpen className="size-3.5" />
                {language}
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight text-white drop-shadow-[0_10px_24px_rgba(2,6,23,0.5)] md:text-6xl">
                {copy.materialsOf}{' '}
                <span className="bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-transparent">
                  {categoryTitle}
                </span>
              </h1>

              <div className="mt-4 inline-flex max-w-full items-center rounded-2xl border border-slate-600/70 bg-slate-950/55 px-4 py-3 text-sm font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:text-base">
                <span className="rounded-full bg-cyan-400/14 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
                  {pageData.total}
                </span>
                <span className="ml-3 text-slate-200">
                  {copy.resources} <span className="text-cyan-200">({language})</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-6 rounded-3xl border border-slate-700/50 bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/35 py-3 pl-10 pr-4 text-slate-200 outline-none transition focus:border-cyan-400"
              />
            </label>

            <button
              type="button"
              onClick={() => setFavoritesOnly((current) => !current)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                favoritesOnly
                  ? 'border-cyan-300/60 bg-cyan-400/12 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]'
                  : 'border-slate-700 bg-slate-950/35 text-slate-200 hover:border-slate-500 hover:bg-slate-800/70'
              }`}
            >
              <Star className={`size-4 ${favoritesOnly ? 'fill-current' : ''}`} />
              {copy.favoritesOnly}
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-slate-200 backdrop-blur-sm">
            {copy.loading}
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
              {pageData.items.map((item, index) => {
                const tint = CARD_TINTS[index % CARD_TINTS.length]

                return (
                <article
                  key={item.id}
                  className={`group relative flex min-h-[220px] flex-col overflow-hidden rounded-[2rem] border p-5 backdrop-blur-sm transition shadow-[0_18px_40px_rgba(8,15,40,0.28)] ${
                    item.favorite ? tint.favorite : tint.default
                  }`}
                >
                  {item.favorite && (
                    <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${tint.topLine} to-transparent`} />
                  )}

                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className={`rounded-2xl p-3 shadow-inner ${tint.icon}`}>
                      <BookOpen className="size-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-blue-500/40 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
                        {item.language || '-'}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleFavoriteToggle(item)}
                        disabled={pendingFavoriteId === item.id}
                        className={`inline-flex size-11 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          item.favorite
                            ? tint.favoriteButton
                            : `border-slate-600/80 bg-slate-950/25 text-slate-300 ${tint.favoriteHover}`
                        }`}
                        aria-label={item.favorite ? copy.unfavorite : copy.favorite}
                        title={item.favorite ? copy.unfavorite : copy.favorite}
                      >
                        <Star className={`size-4 ${item.favorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 flex min-h-[1.5rem] items-center">
                    {item.favorite && (
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${tint.badge}`}>
                        {copy.favorites}
                      </span>
                    )}
                  </div>

                  <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-white">
                    {item.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                    {item.description?.trim() || copy.noDescription}
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                  >
                    {copy.openMaterial}
                    <ExternalLink className="size-4" />
                  </a>
                </article>
              )})}
            </div>

            {pageData.items.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-900/45 p-8 text-center text-slate-300 backdrop-blur-sm">
                {copy.noResults}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/45 px-4 py-3 text-slate-200 backdrop-blur-sm">
              <p>
                {copy.page} {pageData.page} {copy.of} {pageData.totalPages} - {copy.showing}{' '}
                {pageData.items.length} {copy.of} {pageData.total}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((curr) => Math.max(1, curr - 1))}
                  disabled={pageData.page <= 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-2 text-sm font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                  {copy.previous}
                </button>
                <button
                  onClick={() => setPage((curr) => Math.min(pageData.totalPages, curr + 1))}
                  disabled={pageData.page >= pageData.totalPages}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-2 text-sm font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copy.next}
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
