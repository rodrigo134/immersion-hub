import { BookOpen, FolderOpen } from 'lucide-react'
import type { StudyCategorySummary } from '../../types/study'

type Props = {
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

export default function StudyAreas({ categories, loading, onSelectCategory }: Props) {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-black text-white">Areas de Estudo</h2>
          <p className="text-slate-400">
            Categorias vindas do backend, separadas por idioma de estudo.
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-6 text-center text-slate-300 backdrop-blur-sm">
            Carregando categorias...
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/45 p-6 text-center text-slate-300 backdrop-blur-sm">
            Nenhuma categoria encontrada para o idioma selecionado.
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="group rounded-2xl border border-slate-700/50 bg-slate-900/45 p-6 text-left shadow-xl backdrop-blur-sm transition hover:border-slate-600 hover:bg-slate-900/65"
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
                    <div className="text-xs text-slate-400">{category.count} materiais</div>
                  </div>
                </div>

                <p className="mb-4 text-sm text-slate-400">Conteudos para estudo nesta categoria.</p>

                <div className="text-sm font-semibold text-blue-400 transition-transform group-hover:translate-x-1">
                  Explorar -&gt;
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
