import { create } from 'zustand'

export const useStore = create((set) => ({
  theme: 'light',
  swithTheme: (theme) => set((state) => ({ theme })),
  deviceId: null,
  setDeviceId: (deviceId) => set((state) => ({ deviceId })),
  routeName: '',
  setRouteName: (routeName) => set((state) => ({ routeName })),
  prevRouteName: '',
  setPrevRouteName: (prevRouteName) => set((state) => ({ prevRouteName })),
  filters: {
    keyword: '',
    adType: true,
    categories: [],
    date: 'All',
    max: undefined,
    min: undefined,
  },
  setFilters: (filters) => set((state) => ({ filters })),
}))
