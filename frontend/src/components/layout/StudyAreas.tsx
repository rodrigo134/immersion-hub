import { BookOpen, Mic, Headphones, Puzzle } from "lucide-react";

type CategoryId = "reading" | "speaking" | "comprehension" | "extension";

type Category = {
  id: CategoryId;
  title: string;
  description: string;
  stats: string;
  icon: React.ElementType;
  gradient: string; // tailwind classes
};

const categories: Category[] = [
  {
    id: "reading",
    title: "Reading",
    description: "Compreensão de textos e vocabulário através de leitura.",
    stats: "12 materiais",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Pratique pronúncia e ganhe fluência em conversação.",
    stats: "8 exercícios",
    icon: Mic,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "comprehension",
    title: "Comprehension",
    description: "Aprimore sua escuta com áudios e podcasts nativos.",
    stats: "15 áudios",
    icon: Headphones,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "extension",
    title: "Extension",
    description: "Expanda vocabulário e domine expressões avançadas.",
    stats: "200+ palavras",
    icon: Puzzle,
    gradient: "from-orange-500 to-amber-500",
  },
];

type Props = {
  onSelectCategory: (id: CategoryId) => void;
};

export default function StudyAreas({ onSelectCategory }: Props) {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-3">Áreas de Estudo</h2>
          <p className="text-slate-400">
            Organize seus recursos por habilidade e evolua com consistência.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className="group text-left rounded-2xl border border-slate-700/50 bg-slate-900/45 backdrop-blur-sm p-6 shadow-xl transition hover:bg-slate-900/65 hover:border-slate-600"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`rounded-xl p-3 bg-gradient-to-br ${c.gradient} shadow-lg`}
                    aria-hidden="true"
                  >
                    <Icon className="size-6 text-white" />
                  </div>

                  <div>
                    <div className="text-xl font-bold text-white">{c.title}</div>
                    <div className="text-xs text-slate-400">{c.stats}</div>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-4">{c.description}</p>

                <div className="text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Explorar →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

