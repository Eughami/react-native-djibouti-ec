import axiosInstance from '@constants/axiosInstance'

export const adsPerCategory = (page, category = null, sort = null) => {
  if (category === 'trending') return trendingAds()
  let sortStr = 'createdAt,DESC'
  let categoryFilter = ''
  if (category) categoryFilter = `&filter=category.name||eq||${category}`
  if (sortStr) sortStr = sort
  return axiosInstance({
    method: 'get',
    url: `/ads?join=attachment&sort=${sortStr}&limit=4&page=${page}${categoryFilter}`,
  })
    .then((res) => res)
    .catch((err) =>
      errorLog({
        ...err,
        msg: `something went wrong on category ${category} query`,
      }),
    )
}

export const trendingAds = () => {
  return axiosInstance({
    method: 'get',
    url: `/ads/trending`,
  })
    .then((res) => res)
    .catch((err) =>
      errorLog({
        ...err,
        msg: `something went wrong on trending query`,
      }),
    )
}
