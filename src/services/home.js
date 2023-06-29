import axiosInstance from '@constants/axiosInstance'

export const homePageAds = () => {
  return axiosInstance({
    method: 'get',
    url: '/ads?join=attachment&sort=createdAt,DESC&limit=10',
  })
    .then((res) => res)
    .catch((err) => console.log('Error while fetching data'))
}
