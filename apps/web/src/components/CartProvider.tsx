"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  justAdded: string | null;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "qx_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const value = useMemo<CartCtx>(() => {
    return {
      items,
      count: items.length,
      total: items.reduce((s, i) => s + i.price, 0),
      add: (item) => {
        setItems((prev) =>
          prev.some((p) => p.productId === item.productId) ? prev : [...prev, item]
        );
        setJustAdded(item.productId);
        setOpen(true);
        window.setTimeout(() => setJustAdded(null), 1400);
      },
      remove: (productId) =>
        setItems((prev) => prev.filter((p) => p.productId !== productId)),
      clear: () => setItems([]),
      has: (productId) => items.some((p) => p.productId === productId),
      open,
      setOpen,
      justAdded,
    };
  }, [items, open, justAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
