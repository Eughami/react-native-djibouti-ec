import axios from 'axios'
import { API_BASE_URL } from './api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,
})

// API Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    /**
     * * Add future request token here
     */

    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

// API response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // request happened and server responded
    if (error.response) return Promise.reject(error.response.data)

    // request is made but no response received or request triggered an error
    return Promise.reject(error)
  },
)

export default axiosInstance
