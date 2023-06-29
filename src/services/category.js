import axiosInstance from '@constants/axiosInstance'

export const adsPerCategory = (page, category = null) => {
  let categoryFilter = ''
  if (category) categoryFilter = `&filter=category.name||eq||${category}`
  return axiosInstance({
    method: 'get',
    url: `/ads?join=attachment&sort=createdAt,DESC&limit=10&page=${page}${categoryFilter}`,
  })
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.log('Error while fetching data'))
}
