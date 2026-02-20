import { AudioLines, BookOpen, Ear, MessageCircle, Mic, Music2, PenLine, Radio, Repeat2, Sparkles } from 'lucide-react'

type TipItem = {
  title: string
  description: string
  bullets: string[]
  icon: typeof BookOpen
  accent: string
}

const tipsByArea: TipItem[] = [
  {
    title: 'Shadowing Inteligente',
    description: 'Treine ouvido e pronuncia juntos em blocos curtos e repetiveis.',
    bullets: [
      'Pegue audio de 20-40 segundos com transcricao.',
      'Escute 1 vez normal e 1 vez lendo junto.',
      'Repita 3 ciclos: ouvir, pausar, imitar ritmo.',
      'Grave e compare com o original.',
    ],
    icon: Repeat2,
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Estudar com Musica',
    description: 'Use musica para fixar expressoes naturais e melhorar entonacao.',
    bullets: [
      'Escolha uma musica por semana.',
      'Separe 5 frases da letra para estudar.',
      'Cante junto focando em pronuncia e ritmo.',
      'Transforme frases da musica em flashcards.',
    ],
    icon: Music2,
    accent: 'from-rose-500 to-fuchsia-500',
  },
  {
    title: 'Radio e Podcasts',
    description: 'Listening diario com audio real acelera compreensao.',
    bullets: [
      'Comece com 10 minutos por dia.',
      'Anote palavras que se repetem durante a semana.',
      'Escute de novo no dia seguinte para confirmar entendimento.',
      'Resuma em 3 frases o tema principal.',
    ],
    icon: Radio,
    accent: 'from-violet-500 to-indigo-500',
  },
  {
    title: 'Reading com Acao',
    description: 'Leitura com captura ativa de vocabulario gera progresso real.',
    bullets: [
      'Leia textos curtos todos os dias (10-15 min).',
      'Marque apenas 5 palavras novas por sessao.',
      'Crie frase propria para cada palavra.',
      'Revise no dia seguinte em 3 minutos.',
    ],
    icon: BookOpen,
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Comprehension Progressiva',
    description: 'Aumente a dificuldade por etapas para nao travar.',
    bullets: [
      'Semana 1: audio lento com legenda.',
      'Semana 2: audio normal com legenda.',
      'Semana 3: audio normal sem legenda.',
      'Semana 4: resumo oral do que entendeu.',
    ],
    icon: Ear,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Diario de Idioma',
    description: 'Diario curto transforma estudo em consistencia.',
    bullets: [
      'Anote 3 frases novas por dia.',
      'Escreva um mini resumo do estudo.',
      'Marque 1 erro recorrente da semana.',
      'Revise esse diario antes da proxima sessao.',
    ],
    icon: PenLine,
    accent: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Discutir com GPT',
    description: 'Use IA para conversa, correcao e expansao de ideias.',
    bullets: [
      'Peca simulacao de dialogo em tema especifico.',
      'Solicite correcao da sua resposta com explicacao curta.',
      'Peca 3 formas naturais de dizer a mesma frase.',
      'Feche a sessao com vocabulario-chave para revisar.',
    ],
    icon: MessageCircle,
    accent: 'from-sky-500 to-indigo-500',
  },
  {
    title: 'Treino com Voz (Grok/Outros)',
    description: 'Pratica oral em tempo real aumenta confianca ao falar.',
    bullets: [
      'Use modo voz para perguntas e respostas rapidas.',
      'Treine blocos: opiniao, pergunta, concordancia, resumo.',
      'Foque em clareza antes de velocidade.',
      'Repita o mesmo tema em 3 dias diferentes.',
    ],
    icon: AudioLines,
    accent: 'from-teal-500 to-cyan-500',
  },
  {
    title: 'Rotina Curta e Estavel',
    description: 'Sessao curta diaria vence maratona ocasional.',
    bullets: [
      '20 min: 8 min input + 8 min pratica + 4 min revisao.',
      'Use Pomodoro para manter ritmo.',
      'Defina meta semanal objetiva.',
      'Nao quebre a cadeia de dias seguidos.',
    ],
    icon: Sparkles,
    accent: 'from-emerald-500 to-lime-500',
  },
  {
    title: 'Speaking sem Ansiedade',
    description: 'Fluencia melhora com repeticao de estruturas reutilizaveis.',
    bullets: [
      'Monte blocos: opiniao, discordancia, pergunta.',
      'Treine em voz alta 5 minutos por dia.',
      'Reutilize frases-base em temas diferentes.',
      'Priorize naturalidade sobre perfeicao.',
    ],
    icon: Mic,
    accent: 'from-rose-500 to-orange-500',
  },
]

export default function StudyTipsScreen() {
  return (
    <section className="relative z-10 min-h-screen px-6 pb-16 pt-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-slate-700/50 bg-slate-900/45 p-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Playbook</p>
          <h1 className="mt-2 text-5xl font-black text-white md:text-6xl">Dicas de Estudo</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">
            Guia pratico para evoluir com consistencia: musica, radio, diario, IA, voz e rotina diaria.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tipsByArea.map((tip) => {
            const Icon = tip.icon

            return (
              <article
                key={tip.title}
                className="rounded-3xl border border-slate-700/50 bg-slate-900/45 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">{tip.title}</h2>
                    <p className="mt-2 text-sm text-slate-300">{tip.description}</p>
                  </div>

                  <div className={`rounded-2xl bg-gradient-to-br p-3 text-white ${tip.accent}`}>
                    <Icon className="size-5" />
                  </div>
                </div>

                <ul className="space-y-2">
                  {tip.bullets.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-slate-700/40 bg-slate-800/35 px-3 py-2 text-sm text-slate-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
