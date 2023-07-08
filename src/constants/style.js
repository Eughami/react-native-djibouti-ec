export const COLORS = {
  primary: {
    color: '#af5f14',
    colorLight: '#f8f0f7',
    dark100: '#af5f14',
    dark200: '#af5f14',
    dark300: '#af5f14',
    dark400: '#af5f14',
    dark500: '#af5f14',
    dark600: '#af5f14',
    light100: '#af5f14',
    light200: '#af5f14',
    light300: '#af5f14',
    light400: '#af5f14',
    light500: '#af5f14',
    light600: '#af5f14',
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

export const formatPrice = (p) => parseInt(p).toLocaleString('en-US') || p
