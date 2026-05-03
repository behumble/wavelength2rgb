// Dan Bruton's algorithm: http://www.physics.sjsu.edu/stuff/CS_BFA/visiblespectrum.html
// Maps a wavelength in nm (approx 380–780) to an sRGB triple.
export function wavelengthToRgb(wavelength) {
  const w = Number(wavelength)
  let r = 0, g = 0, b = 0

  if (w >= 380 && w < 440) {
    r = -(w - 440) / (440 - 380)
    g = 0
    b = 1
  } else if (w >= 440 && w < 490) {
    r = 0
    g = (w - 440) / (490 - 440)
    b = 1
  } else if (w >= 490 && w < 510) {
    r = 0
    g = 1
    b = -(w - 510) / (510 - 490)
  } else if (w >= 510 && w < 580) {
    r = (w - 510) / (580 - 510)
    g = 1
    b = 0
  } else if (w >= 580 && w < 645) {
    r = 1
    g = -(w - 645) / (645 - 580)
    b = 0
  } else if (w >= 645 && w <= 780) {
    r = 1
    g = 0
    b = 0
  }

  // Intensity falls off near the edges of the visible spectrum.
  let factor = 0
  if (w >= 380 && w < 420) {
    factor = 0.3 + (0.7 * (w - 380)) / (420 - 380)
  } else if (w >= 420 && w < 700) {
    factor = 1
  } else if (w >= 700 && w <= 780) {
    factor = 0.3 + (0.7 * (780 - w)) / (780 - 700)
  }

  const gamma = 0.8
  const adjust = (c) => (c === 0 ? 0 : Math.round(255 * Math.pow(c * factor, gamma)))

  return { r: adjust(r), g: adjust(g), b: adjust(b) }
}

export const rgbToHex = ({ r, g, b }) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()
