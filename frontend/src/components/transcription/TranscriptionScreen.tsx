import { Copy, Mic, Monitor, Pause, RotateCcw, Save, Trash2, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { UiLanguage } from '../../types/ui'

type TranscriptItem = {
  id: string
  text: string
  timestamp: string
  elapsedSeconds: number
}

type SavedRecord = {
  id: string
  title: string
  language: string
  createdAt: string
  audioDataUrl: string
  transcript: TranscriptItem[]
}

type SpeechRecognitionEventLike = Event & {
  resultIndex: number
  results: {
    [index: number]: {
      isFinal: boolean
      0: {
        transcript: string
      }
    }
    length: number
  }
}

type SpeechRecognitionErrorEventLike = Event & {
  error?: string
}

type SpeechRecognitionConstructor = new () => {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

const LOCAL_STORAGE_KEY = 'immersion_hub_transcription_records_v1'

type TranscriptionScreenProps = {
  uiLanguage: UiLanguage
}

const languageOptions = [
  { label: 'English', value: 'en-US' },
  { label: 'Portugues', value: 'pt-BR' },
  { label: 'Espanol', value: 'es-ES' },
  { label: 'Francais', value: 'fr-FR' },
  { label: 'Deutsch', value: 'de-DE' },
]

function nowLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date())
}

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

async function ensureMicrophonePermission() {
  if (!navigator.mediaDevices?.getUserMedia) return false

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop())
    return true
  } catch {
    return false
  }
}

function mapSpeechErrorToMessage(error?: string) {
  if (error === 'not-allowed' || error === 'service-not-allowed') {
    return 'Microfone bloqueado. Libere permissao de microfone no navegador e tente novamente.'
  }
  if (error === 'audio-capture') {
    return 'Nenhuma entrada de audio encontrada. Conecte/ative um microfone no sistema.'
  }
  if (error === 'network') {
    return 'Falha de rede no reconhecimento de voz. Verifique a conexao e tente novamente.'
  }
  if (error === 'aborted') return 'Transcricao interrompida.'
  if (error === 'no-speech') return 'Nenhuma fala detectada. Verifique se o microfone esta captando audio.'
  return 'Falha na transcricao. Verifique permissoes de microfone/voz.'
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Falha ao converter audio.'))
    reader.readAsDataURL(blob)
  })
}

function getSupportedAudioMimeType() {
  const options = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
  return options.find((option) => MediaRecorder.isTypeSupported(option)) || ''
}

function buildRecordTitle(tabName: string, transcript: TranscriptItem[]) {
  const preview = transcript[0]?.text?.trim()
  if (preview) {
    const shortPreview = preview.length > 48 ? `${preview.slice(0, 48)}...` : preview
    return shortPreview
  }
  if (tabName && tabName !== 'Nenhuma aba selecionada') return `Registro - ${tabName}`
  return `Registro ${new Date().toLocaleDateString('pt-BR')}`
}

function loadSavedRecords(): SavedRecord[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as SavedRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function TranscriptionScreen({ uiLanguage }: TranscriptionScreenProps) {
  void uiLanguage
  const [language, setLanguage] = useState('en-US')
  const [isListening, setIsListening] = useState(false)
  const [tabSelected, setTabSelected] = useState(false)
  const [tabName, setTabName] = useState('Nenhuma aba selecionada')
  const [statusMessage, setStatusMessage] = useState('Selecione uma aba e depois inicie a transcricao.')
  const [interimText, setInterimText] = useState('')
  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const [audioDataUrl, setAudioDataUrl] = useState('')
  const [records, setRecords] = useState<SavedRecord[]>(() => loadSavedRecords())
  const [selectedRecordId, setSelectedRecordId] = useState(() => loadSavedRecords()[0]?.id ?? '')
  const [recordingAudio, setRecordingAudio] = useState(false)
  const [playingTime, setPlayingTime] = useState(0)

  const recognitionRef = useRef<InstanceType<SpeechRecognitionConstructor> | null>(null)
  const tabStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const sessionStartRef = useRef<number | null>(null)

  const transcriptText = useMemo(
    () => transcript.map((item) => `[${item.timestamp}] ${item.text}`).join('\n'),
    [transcript],
  )

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) ?? null,
    [records, selectedRecordId],
  )

  const activeSegmentId = useMemo(() => {
    if (!selectedRecord) return ''
    const matches = selectedRecord.transcript.filter((item) => item.elapsedSeconds <= playingTime)
    return matches.at(-1)?.id ?? ''
  }, [selectedRecord, playingTime])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records))
  }, [records])

  async function selectBrowserTab() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setStatusMessage('Seu navegador nao suporta selecao de aba para captura.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 5 },
        audio: true,
      })

      if (tabStreamRef.current) {
        tabStreamRef.current.getTracks().forEach((track) => track.stop())
      }

      tabStreamRef.current = stream
      setTabSelected(true)

      const videoTrack = stream.getVideoTracks()[0]
      const detectedTabName = videoTrack?.label?.trim() || 'Aba selecionada'
      setTabName(detectedTabName)
      setStatusMessage('Aba selecionada. Clique em iniciar para transcrever.')

      videoTrack?.addEventListener('ended', () => {
        setTabSelected(false)
        setIsListening(false)
        setTabName('Nenhuma aba selecionada')
        setStatusMessage('Compartilhamento da aba foi encerrado.')
        recognitionRef.current?.stop()
        stopAudioRecording()
      })
    } catch {
      setStatusMessage('Selecao de aba cancelada ou bloqueada.')
    }
  }

  async function startAudioRecording() {
    if (!tabStreamRef.current) return
    const tabAudioTracks = tabStreamRef.current.getAudioTracks()
    if (tabAudioTracks.length === 0) {
      setStatusMessage('Aba sem trilha de audio. Marque "Compartilhar audio da aba" ao selecionar.')
      return
    }

    try {
      const audioOnlyStream = new MediaStream(tabAudioTracks)
      const mimeType = getSupportedAudioMimeType()
      const recorder = mimeType
        ? new MediaRecorder(audioOnlyStream, { mimeType })
        : new MediaRecorder(audioOnlyStream)

      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (blob.size === 0) return

        try {
          const dataUrl = await blobToDataUrl(blob)
          setAudioDataUrl(dataUrl)
          setStatusMessage('Audio da sessao pronto para salvar.')
        } catch {
          setStatusMessage('Nao foi possivel preparar o audio da sessao.')
        }
      }

      recorder.start(1000)
      mediaRecorderRef.current = recorder
      setRecordingAudio(true)
    } catch {
      setStatusMessage('Falha ao iniciar gravacao de audio da aba.')
    }
  }

  function stopAudioRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setRecordingAudio(false)
  }

  async function startTranscription() {
    const speechWindow = window as WindowWithSpeech
    const SpeechRecognitionImpl = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition

    if (!SpeechRecognitionImpl) {
      setStatusMessage('Transcricao em tempo real nao disponivel neste navegador.')
      return
    }
    if (!tabSelected) {
      setStatusMessage('Antes de iniciar, selecione a aba que sera transcrita.')
      return
    }

    const micAllowed = await ensureMicrophonePermission()
    if (!micAllowed) {
      setStatusMessage('Microfone sem permissao. Autorize o microfone no navegador para iniciar.')
      return
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionImpl()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i]
          const text = result[0]?.transcript?.trim()
          if (!text) continue

          if (result.isFinal) {
            const elapsedSeconds = sessionStartRef.current
              ? Math.max(0, Math.floor((Date.now() - sessionStartRef.current) / 1000))
              : 0

            setTranscript((current) => [
              ...current,
              {
                id: crypto.randomUUID(),
                text,
                timestamp: nowLabel(),
                elapsedSeconds,
              },
            ])
          } else {
            interim = `${interim} ${text}`.trim()
          }
        }
        setInterimText(interim)
      }

      recognition.onerror = (event) => {
        setStatusMessage(mapSpeechErrorToMessage(event.error))
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    if (!recordingAudio) {
      await startAudioRecording()
    }

    sessionStartRef.current = Date.now()
    recognitionRef.current.lang = language
    recognitionRef.current.start()
    setIsListening(true)
    setStatusMessage('Transcricao em andamento...')
  }

  function stopTranscription() {
    recognitionRef.current?.stop()
    stopAudioRecording()
    setIsListening(false)
    setInterimText('')
    setStatusMessage('Transcricao pausada.')
  }

  async function copyTranscript() {
    const content = transcriptText.trim()
    if (!content) {
      setStatusMessage('Ainda nao ha texto para copiar.')
      return
    }
    try {
      await navigator.clipboard.writeText(content)
      setStatusMessage('Transcricao copiada.')
    } catch {
      setStatusMessage('Nao foi possivel copiar para area de transferencia.')
    }
  }

  function clearTranscript() {
    setTranscript([])
    setInterimText('')
    setAudioDataUrl('')
    setStatusMessage('Transcricao limpa.')
  }

  function saveRecord() {
    if (!transcript.length) {
      setStatusMessage('Transcreva algo antes de salvar um registro.')
      return
    }
    if (!audioDataUrl) {
      setStatusMessage('Finalize a sessao para gerar o audio e depois salve o registro.')
      return
    }

    const newRecord: SavedRecord = {
      id: crypto.randomUUID(),
      title: buildRecordTitle(tabName, transcript),
      language,
      createdAt: new Date().toISOString(),
      audioDataUrl,
      transcript,
    }

    setRecords((current) => [newRecord, ...current].slice(0, 20))
    setSelectedRecordId(newRecord.id)
    setStatusMessage('Registro salvo. Agora voce pode reproduzir e acompanhar a transcricao.')
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id))
    setSelectedRecordId((current) => (current === id ? '' : current))
    setStatusMessage('Registro removido.')
  }

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      stopAudioRecording()
      if (tabStreamRef.current) {
        tabStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <section className="relative z-10 min-h-screen px-6 pb-16 pt-28">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-3xl border border-slate-700/50 bg-slate-900/55 p-6 backdrop-blur-sm">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Transcricao</p>
            <h1 className="mt-2 text-4xl font-black text-white">Captura de Aba</h1>
            <p className="mt-2 text-slate-300">
              Grave pequenos registros, escute depois e acompanhe a transcricao no tempo.
            </p>
          </header>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Aba ativa</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{tabName}</p>
            <p className="mt-2 text-xs text-slate-400">{statusMessage}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={selectBrowserTab}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-white hover:bg-slate-700"
            >
              <Monitor className="size-5" />
              Selecionar aba
            </button>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none ring-cyan-400/50 focus:ring"
            >
              {languageOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {!isListening ? (
              <button
                type="button"
                onClick={startTranscription}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-400"
              >
                <Mic className="size-5" />
                Iniciar transcricao
              </button>
            ) : (
              <button
                type="button"
                onClick={stopTranscription}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 font-bold text-slate-950 hover:bg-amber-300"
              >
                <Pause className="size-5" />
                Pausar
              </button>
            )}

            <button
              type="button"
              onClick={saveRecord}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-slate-700"
            >
              <Save className="size-5" />
              Salvar registro
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 sm:col-span-2">
              {recordingAudio ? 'Gravando audio da aba...' : 'Audio pronto ao pausar/salvar'}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Resultado ao vivo</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyTranscript}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  <Copy className="mr-1 inline size-4" />
                  Copiar
                </button>
                <button
                  type="button"
                  onClick={clearTranscript}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  <RotateCcw className="mr-1 inline size-4" />
                  Limpar
                </button>
              </div>
            </div>

            <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
              {transcript.length === 0 && !interimText && (
                <p className="text-sm text-slate-400">Ainda sem trechos transcritos.</p>
              )}

              {transcript.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3">
                  <p className="text-xs text-cyan-300">
                    {item.timestamp} | {formatElapsed(item.elapsedSeconds)}
                  </p>
                  <p className="mt-1 text-sm text-slate-100">{item.text}</p>
                </article>
              ))}

              {interimText && (
                <article className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-3">
                  <p className="text-xs text-cyan-300">Em andamento</p>
                  <p className="mt-1 text-sm text-cyan-100">{interimText}</p>
                </article>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-700/50 bg-slate-900/55 p-6 backdrop-blur-sm">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Registros</p>
            <h2 className="mt-2 text-3xl font-black text-white">Ouvir e acompanhar</h2>
            <p className="mt-2 text-slate-300">Escolha um registro para reproduzir com transcricao sincronizada.</p>
          </header>

          <div className="mt-5 grid gap-4">
            <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
              {records.length === 0 && (
                <p className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-400">
                  Nenhum registro salvo ainda.
                </p>
              )}

              {records.map((record) => (
                <div
                  key={record.id}
                  className={`rounded-xl border p-3 ${
                    selectedRecordId === record.id
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-950/55'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecordId(record.id)
                      setPlayingTime(0)
                    }}
                    className="w-full text-left"
                  >
                    <p className="font-semibold text-white">{record.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(record.createdAt).toLocaleString('pt-BR')} | {record.language}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {record.transcript.length} trecho(s)
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRecord(record.id)}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    <Trash2 className="size-3.5" />
                    Deletar
                  </button>
                </div>
              ))}
            </div>

            {selectedRecord && (
              <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-slate-200">
                  <Volume2 className="size-4" />
                  <span className="text-sm font-semibold">Player do registro</span>
                </div>
                <audio
                  controls
                  src={selectedRecord.audioDataUrl}
                  className="w-full"
                  onTimeUpdate={(event) => setPlayingTime(event.currentTarget.currentTime)}
                />

                <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                  {selectedRecord.transcript.map((item) => (
                    <p
                      key={item.id}
                      className={`rounded-lg border px-2 py-1 text-sm ${
                        activeSegmentId === item.id
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100'
                          : 'border-slate-700 bg-slate-900/75 text-slate-200'
                      }`}
                    >
                      [{formatElapsed(item.elapsedSeconds)}] {item.text}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
              Registros ficam salvos localmente no navegador para revisar depois. Voce pode excluir quando quiser.
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
