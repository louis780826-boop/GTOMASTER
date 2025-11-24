// lib/auth/userStore.ts
// 使用 localStorage 模擬登入系統

export interface User {
  username: string;
  password: string;
  tier: "FREE+";
}

const STORAGE_KEY = "gto_user";

export function saveUser(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function removeUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
