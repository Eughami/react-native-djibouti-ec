import { create } from 'zustand'

export const useStore = create((set) => ({
  theme: 'light',
  swithTheme: (theme) => set((state) => ({ theme })),
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  randomPopulation: (randomNum) => set((state) => ({ bears: randomNum })),
  removeAllBears: () => set({ bears: 0 }),
}))
