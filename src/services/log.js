import axiosInstance from '@constants/axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const postLogs = async (data) => {
  const deviceId = await AsyncStorage.getItem('deviceId')
  if (!deviceId) return

  return axiosInstance({
    method: 'POST',
    url: '/ads/startup',
    data: { ...data, device: { id: deviceId } },
  }).catch((err) => errorLog(err, deviceId))
}

export const adview = async (adId) => {
  const deviceId = await AsyncStorage.getItem('deviceId')
  if (!deviceId) return

  return axiosInstance({
    method: 'POST',
    url: '/devices/view',
    data: { adId, deviceId },
  }).catch((err) => errorLog(err, deviceId))
}

export const errorLog = (err, deviceId) => {
  return axiosInstance({
    method: 'POST',
    url: '/ads/startup',
    data: { type: 'ERROR', payload: err, deviceId },
  }).catch((err) => console.log('Error log not sent :', err))
}
