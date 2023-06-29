export const COLORS = {
  primary: {
    color: '#92278F',
    colorLight: '#f8f0f7',
    dark100: '#872483',
    dark200: '#7C2179',
    dark300: '#721E6F',
    dark400: '#681C65',
    dark500: '#5D195B',
    dark600: '#531651',
    light100: '#A32B9F',
    light200: '#B630B1',
    light300: '#C835C3',
    light400: '#CE47CA',
    light500: '#D359CF',
    light600: '#DD7EDA',
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
