import axiosInstance from '@constants/axiosInstance'

export const adsPerCategory = (page, category = null, sort = null) => {
  console.log('Api called ')
  let sortStr = 'createdAt,DESC'
  let categoryFilter = ''
  if (category) categoryFilter = `&filter=category.name||eq||${category}`
  if (sortStr) sortStr = sort
  return axiosInstance({
    method: 'get',
    url: `/ads?join=attachment&sort=${sortStr}&limit=4&page=${page}${categoryFilter}`,
  })
    .then((res) => res)
    .catch((err) => console.log('Error while fetching data'))
}
