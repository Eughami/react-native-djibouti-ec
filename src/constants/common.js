import { CategoryEnum } from './categories'
import { ROUTES } from './routes'

export const handleRoutetitle = (key) => {
  // TODO.Handle formatting & translation here
  // TODO key with . are nested so only set the last text
  if (key.startsWith('Home.')) return key.split('.').pop()
  return key
}

export const isNestedRoute = (route) => {
  if (Object.keys(CategoryEnum).includes(route)) return true

  // TODO.Add more check here in the future
  return false
}

export const sortOptions = [
  { value: 'createdAt,DESC', label: 'newest' },
  { value: 'createdAt,ASC', label: 'oldest ' },
  { value: 'price,DESC', label: 'most expensive ' },
  { value: 'price,ASC', label: 'cheapest' },
]

export const DateOptions = ['today', 'This week', 'This month', 'All']

const monthListEN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const monthListFR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]
export const formatDate = (date, en = true) => {
  const dd = new Date(date)
  const day = dd.getDate()
  const month = dd.getMonth()

  return `${day} ${
    en ? monthListEN[month] : monthListFR[month]
  } ${dd.getFullYear()}`
}
