import axiosInstance from '@constants/axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { errorLog } from './log'

export const homePageAds = () => {
  return axiosInstance({
    method: 'get',
    url: '/ads?join=attachment&sort=createdAt,DESC&limit=10',
  })
    .then((res) => res)
    .catch((err) => {
      errorLog({ ...err, msg: 'something went wrong on home ads query' })
    })
}

export const getProduct = (id) => {
  if (!id) return
  return axiosInstance({
    method: 'get',
    url: `/ads/${id}?join=attachment`,
  })
    .then((res) => res)
    .catch((err) => {
      errorLog({ ...err, msg: `something went wrong on getProduct ${id}` })
    })
}

export const getMyAds = async () => {
  const deviceId = await AsyncStorage.getItem('deviceId')
  if (!deviceId) return

  return axiosInstance({
    method: 'get',
    url: `/ads?join=attachment&join=device&sort=createdAt,DESC&filter=device.id||eq||${deviceId}`,
  })
    .then((res) => res)
    .catch((err) => {
      errorLog({ ...err, msg: 'Error while getting own ads' }, deviceId)
    })
}

export const deleteAd = (id) => {
  return axiosInstance({
    url: `ads/${id}`,
    method: 'delete',
  })
    .then((data) => data)
    .catch((err) => console.log(err))
}

export const getFav = async () => {
  const deviceId = await AsyncStorage.getItem('deviceId')
  if (!deviceId) return

  return axiosInstance({
    method: 'get',
    url: `/devices/${deviceId}`,
  })
    .then((res) => res)
    .catch((err) => {
      errorLog({ ...err, msg: 'Error while device details' }, deviceId)
    })
}

export const updateFav = async (category) => {
  const deviceId = await AsyncStorage.getItem('deviceId')
  if (!deviceId) return
  return axiosInstance({
    method: 'post',
    url: '/devices/fav',
    data: { category, deviceId },
  })
    .then((res) => res)
    .catch((err) => {
      errorLog({ ...err, msg: 'Error while updating favorite' }, deviceId)
    })
}
