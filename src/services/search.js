import axiosInstance from '@constants/axiosInstance'
import { DateOptions } from '@constants/common'
import { errorLog } from './log'

export const searchAds = (page, filters = {}, sort = null) => {
  console.log('Api called ')
  let sortStr = 'createdAt,DESC'
  if (sortStr) sortStr = sort

  return axiosInstance({
    method: 'get',
    url: `/ads?join=attachment&sort=${sortStr}&limit=10&page=${page}${formatFilters(
      filters,
    )}`,
  })
    .then((res) => res)
    .catch((err) =>
      errorLog({ ...err, msg: 'something went wrong on search query' }),
    )
}

const formatFilters = (filters) => {
  let filterStr = ''
  // keyword
  if (filters.keyword)
    filterStr += `&filter=title||$contL||${filters.keyword}&filter=description||$contL||${filters.keyword}`
  // categories
  if (filters.categories?.length > 0)
    filterStr += `&filter=category.name||in||${filters.categories.toString()}`
  //  adtype
  if (filters.adType) filterStr += `&filter=isService||eq||${!filters.adType}`
  // price min & max
  if (filters.min)
    filterStr += `&filter=price||gte||${filters.min.replace(/[^0-9]/g, '')}`
  if (filters.max)
    filterStr += `&filter=price||lte||${filters.max.replace(/[^0-9]/g, '')}`
  // date
  if (filters.date && filters.date !== 'All')
    filterStr += `&filter=createdAt||gt||${formatDateOptions(
      filters.date,
    )}T00:00:00`

  console.log({ filters, filterStr })
  return filterStr
}

const formatDateOptions = (option) => {
  switch (option) {
    case 'today':
      return getDateXDaysBefore(0)
    case 'week':
      return getDateXDaysBefore(7)
    case 'month':
      return getDateXDaysBefore(30)

    default:
      break
  }
}

function getDateXDaysBefore(x) {
  const currentDate = new Date()
  const desiredDate = new Date(currentDate.getTime() - x * 24 * 60 * 60 * 1000)
  const year = desiredDate.getFullYear()
  const month = String(desiredDate.getMonth() + 1).padStart(2, '0')
  const day = String(desiredDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
