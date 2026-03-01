"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { iphoneModels, type IphoneModel } from "../data/iphoneModels";

export const CART_STORAGE_KEY = "hope:wishlist:item-ids";

type CartContextValue = {
  cartItemIds: string[];
  cartItems: IphoneModel[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  toggleItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const getStoredCartItemIds = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedItemIds = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedItemIds) {
      return [];
    }

    const parsedItemIds: unknown = JSON.parse(storedItemIds);
    if (!Array.isArray(parsedItemIds)) {
      return [];
    }

    return parsedItemIds.filter(
      (itemId): itemId is string =>
        typeof itemId === "string" &&
        iphoneModels.some((phone) => phone.id === itemId)
    );
  } catch {
    return [];
  }
};

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItemIds, setCartItemIds] = useState<string[]>(() =>
    getStoredCartItemIds()
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItemIds));
    window.dispatchEvent(new Event("wishlist-updated"));
  }, [cartItemIds]);

  useEffect(() => {
    const syncFromStorage = () => {
      setCartItemIds(getStoredCartItemIds());
    };

    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(
    () => setIsCartOpen((previous) => !previous),
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setCartItemIds((currentItemIds) =>
      currentItemIds.filter((existingItemId) => existingItemId !== itemId)
    );
  }, []);

  const toggleItem = useCallback((itemId: string) => {
    setCartItemIds((currentItemIds) =>
      currentItemIds.includes(itemId)
        ? currentItemIds.filter((existingItemId) => existingItemId !== itemId)
        : [...currentItemIds, itemId]
    );
  }, []);

  const cartItems = useMemo<IphoneModel[]>(
    () =>
      cartItemIds
        .map((itemId) => iphoneModels.find((phone) => phone.id === itemId))
        .filter((item): item is IphoneModel => Boolean(item)),
    [cartItemIds]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cartItemIds,
      cartItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      toggleItem,
      removeItem,
    }),
    [
      cartItemIds,
      cartItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      toggleItem,
      removeItem,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
};
