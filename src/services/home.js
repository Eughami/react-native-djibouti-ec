import axiosInstance from '@constants/axiosInstance'

export const homePageAds = () => {
  return axiosInstance({
    method: 'get',
    url: '/ads?join=attachment&sort=createdAt,DESC&limit=10',
  })
    .then((res) => res)
    .catch((err) =>
      errorLog({ ...err, msg: 'something went wrong on home ads query' }),
    )
}

export const getProduct = (id) => {
  if (!id) return
  return axiosInstance({
    method: 'get',
    url: `/ads/${id}?join=attachment`,
  })
    .then((res) => res)
    .catch((err) =>
      errorLog({ ...err, msg: `something went wrong on getProduct ${id}` }),
    )
}
