import { ArrowRight, BookOpen, FolderOpen } from 'lucide-react'
import type { StudyCategorySummary } from '../../types/study'
import type { UiLanguage } from '../../types/ui'

type Props = {
  uiLanguage: UiLanguage
  categories: StudyCategorySummary[]
  loading: boolean
  onSelectCategory: (id: string) => void
}

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500 to-fuchsia-500',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-pink-500',
]

export default function StudyAreas({ uiLanguage, categories, loading, onSelectCategory }: Props) {
  const copy =
    uiLanguage === 'EN'
      ? {
          title: 'Study Areas',
          subtitle: '',
          loading: 'Loading categories...',
          empty: 'No categories found for the selected language.',
          materials: 'materials',
          description: 'Content available for study in this category.',
          explore: 'Explore',
        }
      : {
          title: 'Areas de Estudo',
          subtitle: '',
          loading: 'Carregando categorias...',
          empty: 'Nenhuma categoria encontrada para o idioma selecionado.',
          materials: 'materiais',
          description: 'Conteudos para estudo nesta categoria.',
          explore: 'Explorar',
        }

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-slate-800/70 bg-[linear-gradient(180deg,rgba(2,6,23,0.78),rgba(15,23,42,0.68))] px-6 py-8 shadow-[0_24px_70px_rgba(2,6,23,0.4)] backdrop-blur-md">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_45%)]" />
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-300/55 to-cyan-400/10" />
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-100">
              Hub
              </span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent via-cyan-300/55 to-cyan-400/10" />
            </div>

            <h2 className="mb-3 bg-gradient-to-r from-slate-50 via-cyan-100 to-sky-200 bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-[0_8px_24px_rgba(34,211,238,0.10)] md:text-5xl">
              {copy.title}
            </h2>
            {copy.subtitle && <p className="text-slate-400">{copy.subtitle}</p>}
          </div>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-6 text-center text-slate-300 backdrop-blur-sm">
            {copy.loading}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-6 text-center text-slate-300 backdrop-blur-sm">
            {copy.empty}
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="group rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 text-left shadow-[0_18px_40px_rgba(2,6,23,0.35)] backdrop-blur-md transition hover:border-slate-600 hover:bg-slate-900/78"
              >
                <div className="mb-3 flex items-center gap-4">
                  <div
                    className={`rounded-xl bg-gradient-to-br p-3 ${gradients[index % gradients.length]} shadow-lg`}
                    aria-hidden="true"
                  >
                    {index % 2 === 0 ? (
                      <BookOpen className="size-6 text-white" />
                    ) : (
                      <FolderOpen className="size-6 text-white" />
                    )}
                  </div>

                  <div>
                    <div className="text-xl font-bold text-white">{category.title}</div>
                    <div className="text-xs text-slate-400">
                      {category.count} {copy.materials}
                    </div>
                  </div>
                </div>

                <p className="mb-4 text-sm text-slate-400">{copy.description}</p>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-transform group-hover:translate-x-1">
                  <span>{copy.explore}</span>
                  <ArrowRight className="size-4" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
