export const COLORS = {
  light: {
    dominant: '#FF8C00',
    secondary: '#006D6F',
    accent: '#FDF6E3',
    dominantShade1: '#d17300',
    dominantShade2: '#FFD19A',
    dominantShade3: '#FFE7CC',
    placeholder: '#535353',
    inputBG: '#F2F2F2',
  },
  dark: {
    dominant: '#FF7F00',
    secondary: '#006D6F',
    accent: '#EDEDED',
    dominantShade1: '#d3792a',
    dominantShade2: '#FFA766',
    dominantShade3: '#FFC499',
    placeholder: '#8a8a8a',
    inputBG: '#2b2e3dff',
  },
}

export function hexToRgb(hex) {
  console.log(hex)
  // Remove the "#" symbol if present
  hex = hex.replace('#', '')

  // Extract the individual RGB component values
  const red = parseInt(hex.substring(0, 2), 16)
  const green = parseInt(hex.substring(2, 4), 16)
  const blue = parseInt(hex.substring(4, 6), 16)

  // Return the RGB values as an object
  return { red, green, blue }
}

export function extractRgbComponents(rgbColor) {
  // Extract the numeric values from the RGB color string
  const regex = /(\d+)/g
  const matches = rgbColor.match(regex)

  if (!matches || matches.length !== 3) {
    throw new Error(`Invalid RGB color format: ${rgbColor}`)
  }

  // Parse the extracted values as integers
  const red = parseInt(matches[0], 10)
  const green = parseInt(matches[1], 10)
  const blue = parseInt(matches[2], 10)

  // Return the RGB component values as an object
  return { red, green, blue }
}

export function getLighterShade(rgb, opacity) {
  const { blue, green, red } = extractRgbComponents(rgb)
  return `rgba(${red},${green},${blue},${opacity} )`
}

export const formatPrice = (p) => parseInt(p).toLocaleString('en-US') || p
