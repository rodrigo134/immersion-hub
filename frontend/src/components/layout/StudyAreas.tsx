import { STUDY_CATEGORIES } from '../../constants/studyCategories'
import type { StudyCategoryId } from '../../types/study'

type Props = {
  onSelectCategory: (id: StudyCategoryId) => void
}

export default function StudyAreas({ onSelectCategory }: Props) {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-black text-white">Areas de Estudo</h2>
          <p className="text-slate-400">
            Organize seus recursos por habilidade e evolua com consistencia.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {STUDY_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="group rounded-2xl border border-slate-700/50 bg-slate-900/45 p-6 text-left shadow-xl backdrop-blur-sm transition hover:border-slate-600 hover:bg-slate-900/65"
              >
                <div className="mb-3 flex items-center gap-4">
                  <div
                    className={`rounded-xl bg-gradient-to-br p-3 ${category.gradient} shadow-lg`}
                    aria-hidden="true"
                  >
                    <Icon className="size-6 text-white" />
                  </div>

                  <div>
                    <div className="text-xl font-bold text-white">{category.title}</div>
                    <div className="text-xs text-slate-400">{category.stats}</div>
                  </div>
                </div>

                <p className="mb-4 text-sm text-slate-400">{category.subtitle}</p>

                <div className="text-sm font-semibold text-blue-400 transition-transform group-hover:translate-x-1">
                  Explorar -&gt;
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

