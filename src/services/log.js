import axiosInstance from '@constants/axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const postLogs = async (data) => {
  const deviceId = await AsyncStorage.getItem('deviceId')
  if (!deviceId) return

  return axiosInstance({
    method: 'POST',
    url: '/ads/startup',
    data: { ...data, device: { id: deviceId } },
  }).catch((err) => console.log('Failed to send logs :', err))
}
