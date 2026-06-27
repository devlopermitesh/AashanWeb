'use client'

import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type CartItem = {
  productId: string
  quantity: number
  variantId?: string
}

export type CartShop = {
  shopId: string
  items: CartItem[]
}

type AddProductOptions = {
  quantity?: number
  variantId?: string
}

type CartState = {
  shopCart: CartShop[]
  addProduct: (shopId: string, productId: string, options?: AddProductOptions) => void
  removeProduct: (shopId: string, productId: string, variantId?: string) => void
  updateQuantity: (shopId: string, productId: string, quantity: number, variantId?: string) => void
  clearCart: (shopId: string) => void
  clearAllCart: () => void
  getCartProducts: (shopId: string) => CartItem[]
  hasProduct: (shopId: string, productId: string, variantId?: string) => boolean
  getItemCount: () => number
}

type LegacyCartShop = {
  shopId?: unknown
  productIds?: unknown
  items?: unknown
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

const cartStorage = createJSONStorage(() =>
  typeof window === 'undefined' ? noopStorage : window.localStorage
)

const clampQuantity = (quantity?: number): number => {
  if (typeof quantity !== 'number' || !Number.isFinite(quantity)) {
    return 1
  }

  return Math.max(1, Math.round(quantity))
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeCartItem = (value: unknown): CartItem | null => {
  if (typeof value === 'string' && value.trim()) {
    return {
      productId: value,
      quantity: 1,
    }
  }

  if (!isRecord(value) || typeof value.productId !== 'string' || !value.productId.trim()) {
    return null
  }

  return {
    productId: value.productId,
    quantity: clampQuantity(
      typeof value.quantity === 'number' ? value.quantity : Number(value.quantity ?? 1)
    ),
    variantId:
      typeof value.variantId === 'string' && value.variantId.trim() ? value.variantId : undefined,
  }
}

const normalizeShopCart = (value: unknown): CartShop[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((shop): CartShop | null => {
      const source = shop as LegacyCartShop
      if (typeof source.shopId !== 'string' || !source.shopId.trim()) {
        return null
      }

      const rawItems = Array.isArray(source.items)
        ? source.items
        : Array.isArray(source.productIds)
          ? source.productIds
          : []

      const items = rawItems
        .map((item) => normalizeCartItem(item))
        .filter((item): item is CartItem => Boolean(item))

      if (items.length === 0) {
        return null
      }

      return {
        shopId: source.shopId,
        items,
      }
    })
    .filter((shop): shop is CartShop => Boolean(shop))
}

const isSameLineItem = (item: CartItem, productId: string, variantId?: string) =>
  item.productId === productId && item.variantId === variantId

const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      shopCart: [],

      addProduct: (shopId, productId, options) =>
        set((state) => {
          const quantityToAdd = clampQuantity(options?.quantity)
          const variantId = options?.variantId?.trim() || undefined
          const existingShop = state.shopCart.find((shop) => shop.shopId === shopId)

          if (!existingShop) {
            return {
              shopCart: [
                ...state.shopCart,
                {
                  shopId,
                  items: [{ productId, quantity: quantityToAdd, variantId }],
                },
              ],
            }
          }

          const existingItem = existingShop.items.find((item) =>
            isSameLineItem(item, productId, variantId)
          )

          if (!existingItem) {
            return {
              shopCart: state.shopCart.map((shop) =>
                shop.shopId === shopId
                  ? {
                      ...shop,
                      items: [...shop.items, { productId, quantity: quantityToAdd, variantId }],
                    }
                  : shop
              ),
            }
          }

          return {
            shopCart: state.shopCart.map((shop) =>
              shop.shopId === shopId
                ? {
                    ...shop,
                    items: shop.items.map((item) =>
                      isSameLineItem(item, productId, variantId)
                        ? {
                            ...item,
                            quantity: item.quantity + quantityToAdd,
                          }
                        : item
                    ),
                  }
                : shop
            ),
          }
        }),

      removeProduct: (shopId, productId, variantId) =>
        set((state) => ({
          shopCart: state.shopCart
            .map((shop) =>
              shop.shopId === shopId
                ? {
                    ...shop,
                    items: shop.items.filter((item) => !isSameLineItem(item, productId, variantId)),
                  }
                : shop
            )
            .filter((shop) => shop.items.length > 0),
        })),

      updateQuantity: (shopId, productId, quantity, variantId) =>
        set((state) => ({
          shopCart: state.shopCart
            .map((shop) =>
              shop.shopId === shopId
                ? {
                    ...shop,
                    items: shop.items
                      .map((item) =>
                        isSameLineItem(item, productId, variantId)
                          ? {
                              ...item,
                              quantity: clampQuantity(quantity),
                            }
                          : item
                      )
                      .filter((item) => item.quantity > 0),
                  }
                : shop
            )
            .filter((shop) => shop.items.length > 0),
        })),

      clearCart: (shopId) =>
        set((state) => ({
          shopCart: state.shopCart.filter((shop) => shop.shopId !== shopId),
        })),

      clearAllCart: () => set({ shopCart: [] }),

      getCartProducts: (shopId) =>
        get().shopCart.find((shop) => shop.shopId === shopId)?.items ?? [],

      hasProduct: (shopId, productId, variantId) =>
        get()
          .shopCart.find((shop) => shop.shopId === shopId)
          ?.items.some((item) => isSameLineItem(item, productId, variantId)) ?? false,

      getItemCount: () =>
        get().shopCart.reduce(
          (total, shop) => total + shop.items.reduce((sum, item) => sum + item.quantity, 0),
          0
        ),
    }),
    {
      name: 'checkout-cart',
      version: 2,
      storage: cartStorage,
      partialize: (state) => ({ shopCart: state.shopCart }),
      migrate: (persistedState) => {
        const source = isRecord(persistedState) ? persistedState : {}

        return {
          ...source,
          shopCart: normalizeShopCart(source.shopCart),
        } as CartState
      },
    }
  )
)

export default useCart
