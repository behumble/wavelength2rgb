import { useEffect, useMemo, useState } from 'react'
import { wavelengthToRgb, rgbToHex } from './wavelengthToRgb.js'
import { useLocale, SUPPORTED } from './i18n.js'

const MIN = 380
const MAX = 780
const DEFAULT_WAVELENGTH = 550

function parseHashWavelength() {
  if (typeof window === 'undefined') return null
  const m = window.location.hash.match(/^#(\d+)$/)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

export default function App() {
  const [wavelength, setWavelength] = useState(() => parseHashWavelength() ?? DEFAULT_WAVELENGTH)
  const { locale, setLocale, t } = useLocale()

  // Reflect numeric wavelength in the URL hash. replaceState avoids history spam while sliding
  // and avoids the scroll-jump that a direct `location.hash = …` assignment would cause.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof wavelength !== 'number' || !Number.isFinite(wavelength)) return
    const desired = `#${wavelength}`
    if (window.location.hash !== desired) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${desired}`)
    }
  }, [wavelength])

  // Honor browser back/forward and external hash edits.
  useEffect(() => {
    const handler = () => {
      const next = parseHashWavelength()
      setWavelength(next ?? DEFAULT_WAVELENGTH)
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const rgb = useMemo(() => wavelengthToRgb(wavelength), [wavelength])
  const hex = rgbToHex(rgb)
  const cssColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const inRange = wavelength >= MIN && wavelength <= MAX

  const handleNumberChange = (e) => {
    const v = e.target.value
    if (v === '') {
      setWavelength('')
      return
    }
    setWavelength(Number(v))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t.title}</h1>
        <div className="lang-switch" role="group" aria-label="Language">
          {SUPPORTED.map((code) => (
            <button
              key={code}
              type="button"
              className={code === locale ? 'is-active' : ''}
              aria-pressed={code === locale}
              onClick={() => setLocale(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <p className="hint">{t.hint}</p>

      <div className="swatch" style={{ background: inRange ? cssColor : '#000' }}>
        <span className="swatch-label" style={{ color: inRange ? readableText(rgb) : '#888' }}>
          {inRange ? t.nm(wavelength) : t.outOfRange}
        </span>
      </div>

      <div className="controls">
        <label>
          <span>{t.wavelengthLabel}</span>
          <input
            type="number"
            min={MIN}
            max={MAX}
            step="1"
            value={wavelength}
            onChange={handleNumberChange}
          />
        </label>

        <input
          type="range"
          min={MIN}
          max={MAX}
          step="1"
          value={inRange ? wavelength : MIN}
          onChange={(e) => setWavelength(Number(e.target.value))}
          className="slider"
        />
      </div>

      <dl className="readout">
        <div>
          <dt>{t.rgb}</dt>
          <dd>{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</dd>
        </div>
        <div>
          <dt>{t.hex}</dt>
          <dd>{hex}</dd>
        </div>
        <div>
          <dt>{t.css}</dt>
          <dd>{cssColor}</dd>
        </div>
      </dl>

      <section className="refs">
        <h2>{t.learnMore}</h2>
        <ul>
          <li>
            <a href="https://en.wikipedia.org/wiki/Electromagnetic_spectrum" target="_blank" rel="noreferrer noopener">
              {t.refs.emSpectrum.title}
            </a>
            <span>{t.refs.emSpectrum.desc}</span>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Visible_spectrum" target="_blank" rel="noreferrer noopener">
              {t.refs.visibleSpectrum.title}
            </a>
            <span>{t.refs.visibleSpectrum.desc}</span>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Ultraviolet" target="_blank" rel="noreferrer noopener">
              {t.refs.uv.title}
            </a>
            <span>{t.refs.uv.desc}</span>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Infrared" target="_blank" rel="noreferrer noopener">
              {t.refs.ir.title}
            </a>
            <span>{t.refs.ir.desc}</span>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Color_vision" target="_blank" rel="noreferrer noopener">
              {t.refs.colorVision.title}
            </a>
            <span>{t.refs.colorVision.desc}</span>
          </li>
        </ul>
        <p className="refs-note">
          {t.notePrefix}
          <a href="https://academo.org/demos/wavelength-to-colour-relationship/" target="_blank" rel="noreferrer noopener">
            {t.brutonLink}
          </a>
          {t.noteSuffix}
        </p>
      </section>
    </div>
  )
}

function readableText({ r, g, b }) {
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma > 0.55 ? '#111' : '#fff'
}
