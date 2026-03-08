import { create } from 'zustand'

interface UseCartStyle {
  cardVisibity: 'open' | 'close'
  toggle: () => void
  open: () => void
  close: () => void
}

const useCartStyle = create<UseCartStyle>()((set) => ({
  cardVisibity: 'close',

  toggle: () =>
    set((state) => ({
      cardVisibity: state.cardVisibity === 'open' ? 'close' : 'open',
    })),

  open: () =>
    set({
      cardVisibity: 'open',
    }),

  close: () =>
    set({
      cardVisibity: 'close',
    }),
}))

export default useCartStyle
