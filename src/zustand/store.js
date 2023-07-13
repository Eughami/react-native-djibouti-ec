import { create } from 'zustand'

export const useStore = create((set) => ({
  theme: 'light',
  swithTheme: (theme) => set((state) => ({ theme })),
  deviceId: null,
  setDeviceId: (deviceId) => set((state) => ({ deviceId })),
  routeName: '',
  setRouteName: (routeName) => set((state) => ({ routeName })),
  favCat: [],
  setFavCat: (favCat) => set((state) => ({ favCat })),
  lang: 'en',
  setLang: (lang) => set((state) => ({ lang })),
  filters: {
    keyword: '',
    adType: true,
    categories: [],
    date: 'all',
    max: undefined,
    min: undefined,
  },
  setFilters: (filters) => set((state) => ({ filters })),
}))
