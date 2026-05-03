import { useEffect, useState } from 'react'

export const SUPPORTED = ['en', 'ko']
const STORAGE_KEY = 'wavelength2rgb.locale'

const translations = {
  en: {
    title: 'Wavelength → RGB',
    hint: 'Visible spectrum: 380–780 nm',
    wavelengthLabel: 'Wavelength (nm)',
    nm: (v) => `${v} nm`,
    outOfRange: 'out of range',
    rgb: 'RGB',
    hex: 'HEX',
    css: 'CSS',
    learnMore: 'Learn more',
    refs: {
      emSpectrum: { title: 'Electromagnetic spectrum', desc: ' — overview of all wavelengths from radio to gamma rays.' },
      visibleSpectrum: { title: 'Visible spectrum', desc: ' — ~380–780 nm, the band the human eye can see.' },
      uv: { title: 'Ultraviolet (UV)', desc: ' — shorter than ~380 nm, down to ~10 nm.' },
      ir: { title: 'Infrared (IR)', desc: ' — longer than ~780 nm, up to ~1 mm.' },
      colorVision: { title: 'Color vision', desc: ' — how the eye and brain map wavelengths to perceived color.' },
    },
    notePrefix: 'Conversion uses ',
    brutonLink: 'Dan Bruton’s approximation',
    noteSuffix: '. Outside the visible band, no RGB color exists — IR and UV are shown as black.',
  },
  ko: {
    title: '파장 → RGB',
    hint: '가시광선 영역: 380–780 nm',
    wavelengthLabel: '파장 (nm)',
    nm: (v) => `${v} nm`,
    outOfRange: '범위를 벗어남',
    rgb: 'RGB',
    hex: 'HEX',
    css: 'CSS',
    learnMore: '더 알아보기',
    refs: {
      emSpectrum: { title: '전자기 스펙트럼', desc: ' — 전파부터 감마선까지 모든 파장에 대한 개요.' },
      visibleSpectrum: { title: '가시광선 스펙트럼', desc: ' — 약 380–780 nm, 사람 눈이 볼 수 있는 영역.' },
      uv: { title: '자외선 (UV)', desc: ' — 약 380 nm보다 짧으며, 약 10 nm까지.' },
      ir: { title: '적외선 (IR)', desc: ' — 약 780 nm보다 길며, 약 1 mm까지.' },
      colorVision: { title: '색각', desc: ' — 눈과 뇌가 파장을 색으로 인식하는 방식.' },
    },
    notePrefix: '변환에는 ',
    brutonLink: '댄 브루튼(Dan Bruton)의 근사식',
    noteSuffix: '을 사용합니다. 가시광선 범위 밖(IR·UV)에는 대응하는 RGB 색이 없으므로 검은색으로 표시됩니다.',
  },
}

function detectInitialLocale() {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED.includes(stored)) return stored
  } catch {
    // localStorage may be unavailable (private mode, etc.) — fall through to detection.
  }
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en']
  for (const raw of langs) {
    const code = raw.toLowerCase().split('-')[0]
    if (SUPPORTED.includes(code)) return code
  }
  return 'en'
}

export function useLocale() {
  const [locale, setLocaleState] = useState(detectInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Ignore — persistence is best-effort.
    }
  }, [locale])

  const setLocale = (next) => {
    if (SUPPORTED.includes(next)) setLocaleState(next)
  }

  return { locale, setLocale, t: translations[locale] }
}
