import { CategoryEnum } from './categories'
import { ROUTES } from './routes'

export const handleRoutetitle = (key) => {
  // TODO.Handle formatting & translation here
  if (key.startsWith(ROUTES.HOME_CATEGORY)) return key.split('.').pop()
  return key
}

export const isNestedRoute = (route) => {
  if (Object.keys(CategoryEnum).includes(route)) return true

  // TODO.Add more check here in the future
  return false
}
