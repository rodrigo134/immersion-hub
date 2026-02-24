import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import type { UiLanguage } from '../../types/ui'

type CountryMood = {
  country: string
  city: string
  code: string
  images: string[]
}

const countries: CountryMood[] = [
  {
    country: 'Franca',
    city: 'Paris',
    code: 'FR',
    images: [
      'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?quto=format&fit=crop&w=2200&q=80',
    ],
  },
  {
    country: 'Japao',
    city: 'Toquio',
    code: 'JP',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1532236204992-f5e85c024202?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1554643511-3cbd010afaf5?auto=format&fit=crop&w=2200&q=80'
    ],
  },
  {
    country: 'Reino Unido',
    city: 'Londres',
    code: 'UK',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=2200&q=80',
    ],
  },
  {
    country: 'Espanha',
    city: 'Madri',
    code: 'ES',
    images: [
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1578307988779-5ac74f536f9f?auto=format&fit=crop&w=2200&q=80',
    ],
  },
  {
    country: 'Alemanha',
    city: 'Berlim',
    code: 'DE',
    images: [
      'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=2200&q=80',
    ],
  },
  {
    country: 'Brasil',
    city: 'Rio de Janeiro',
    code: 'BR',
    images: [
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=2200&q=80',
      'https://images.unsplash.com/photo-1544989164-22ad4b5d0100?auto=format&fit=crop&w=2200&q=80',
    ],
  },
]

const fallbackImage =
  'https://images.unsplash.com/photo-1551778742-5f6acf67d4bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2200&h=1400'

type SafeImageProps = {
  src: string
  alt: string
  className: string
  onClick?: (event: MouseEvent<HTMLImageElement>) => void
}

function SafeImage({ src, alt, className, onClick }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (currentSrc !== fallbackImage) setCurrentSrc(fallbackImage)
      }}
    />
  )
}

type InspirationScreenProps = {
  uiLanguage: UiLanguage
}

export default function InspirationScreen({ uiLanguage }: InspirationScreenProps) {
  const [countryIndex, setCountryIndex] = useState<number | null>(null)
  const [photoIndex, setPhotoIndex] = useState(0)

  const selectedCountry = countryIndex !== null ? countries[countryIndex] : null
  const selectedImages = useMemo(() => selectedCountry?.images ?? [], [selectedCountry])
  const copy =
    uiLanguage === 'EN'
      ? {
          title: 'Inspiration by Country',
          subtitle: 'One card per country. Click to open full-screen gallery.',
          close: 'Close',
          previous: 'Previous',
          next: 'Next',
        }
      : {
          title: 'Inspiracao por Paises',
          subtitle: 'Um card por pais. Clique para abrir galeria em tela cheia (fotos reais selecionadas).',
          close: 'Fechar',
          previous: 'Anterior',
          next: 'Proxima',
        }

  useEffect(() => {
    if (!selectedCountry) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setCountryIndex(null)
        setPhotoIndex(0)
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setPhotoIndex((curr) => {
          const n = selectedImages.length || 1
          return (curr - 1 + n) % n
        })
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setPhotoIndex((curr) => {
          const n = selectedImages.length || 1
          return (curr + 1) % n
        })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [selectedCountry, selectedImages.length])

  function openCountry(index: number) {
    setCountryIndex(index)
    setPhotoIndex(0)
  }

  function closeViewer() {
    setCountryIndex(null)
    setPhotoIndex(0)
  }

  function prevPhoto() {
    if (!selectedCountry) return
    const n = selectedImages.length || 1
    setPhotoIndex((curr) => (curr - 1 + n) % n)
  }

  function nextPhoto() {
    if (!selectedCountry) return
    const n = selectedImages.length || 1
    setPhotoIndex((curr) => (curr + 1) % n)
  }

  const fullImage = useMemo(() => {
    if (!selectedCountry) return ''
    return selectedImages[photoIndex] ?? fallbackImage
  }, [selectedCountry, selectedImages, photoIndex])

  return (
    <section className="relative z-10 min-h-screen px-6 pb-16 pt-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-slate-700/50 bg-slate-900/45 p-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Moodboard</p>
          <h1 className="mt-2 text-5xl font-black text-white md:text-6xl">{copy.title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300">{copy.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {countries.map((item, index) => {
            const cover = item.images[0] ?? fallbackImage

            return (
              <button
                key={item.country}
                onClick={() => openCountry(index)}
                className="group relative h-64 overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/40 text-left"
                type="button"
              >
                <SafeImage
                  src={cover}
                  alt={item.country}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <h2 className="text-5xl font-black text-white">{item.city}</h2>
                  <p className="text-lg font-semibold text-slate-200">
                    {item.country} {item.code}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedCountry && (
        <div
          className="fixed inset-0 z-[95] flex h-screen w-screen items-center justify-center overflow-hidden bg-black"
          onClick={closeViewer}
        >
          <button
            onClick={(event) => {
              event.stopPropagation()
              closeViewer()
            }}
            className="absolute right-4 top-4 z-[96] rounded-full border border-white/30 bg-black/40 p-2 text-white hover:bg-black/60"
            aria-label={copy.close}
            type="button"
          >
            <X className="size-6" />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation()
              prevPhoto()
            }}
            className="absolute left-4 top-1/2 z-[96] -translate-y-1/2 rounded-full border border-white/30 bg-black/40 p-2 text-white hover:bg-black/60"
            aria-label={copy.previous}
            type="button"
          >
            <ChevronLeft className="size-7" />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation()
              nextPhoto()
            }}
            className="absolute right-4 top-1/2 z-[96] -translate-y-1/2 rounded-full border border-white/30 bg-black/40 p-2 text-white hover:bg-black/60"
            aria-label={copy.next}
            type="button"
          >
            <ChevronRight className="size-7" />
          </button>

          <SafeImage
            src={fullImage}
            alt={`${selectedCountry.country} ${photoIndex + 1}`}
            className="h-screen w-screen object-cover"
            onClick={(event) => event.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 z-[96] -translate-x-1/2 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm text-white">
            {selectedCountry.country} - {photoIndex + 1}/{Math.max(selectedImages.length, 1)}
          </div>
        </div>
      )}
    </section>
  )
}
