import { create } from 'zustand'

export const useStore = create((set) => ({
  theme: 'light',
  swithTheme: (theme) => set((state) => ({ theme })),
  routeName: '',
  setRouteName: (routeName) => set((state) => ({ routeName })),
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
