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
    .then((res) => {
      console.log('Res', res)
      return res
    })
    .catch((err) => {
      console.log(err)
      errorLog({ ...err, msg: 'something went wrong on search query' })
    })
}

const formatFilters = (filters) => {
  let arr = []
  // keyword
  if (filters.keyword) {
    arr.push({
      $or: [
        { title: { $contL: filters.keyword } },
        { description: { $contL: filters.keyword } },
        { subtitle: { $contL: filters.keyword } },
        { subdesc: { $contL: filters.keyword } },
      ],
    })
  }
  // categories
  if (filters.categories?.length > 0)
    arr.push({
      'category.name': { in: filters.categories },
    })
  //  adtype
  if (filters.adType)
    arr.push({
      isService: !filters.adType,
    })

  // price min & max
  if (filters.min)
    arr.push({
      price: { gte: filters.min.replace(/[^0-9]/g, '') },
    })
  if (filters.max)
    arr.push({ price: { lte: filters.max.replace(/[^0-9]/g, '') } })
  // date
  if (filters.date && filters.date !== 'all')
    arr.push({
      createdAt: { gt: `${formatDateOptions(filters.date)}T00:00:00` },
    })

  const res = `&s=${JSON.stringify({ $and: arr })}`
  console.log(res)
  return res
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
