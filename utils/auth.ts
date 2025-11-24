// utils/auth.ts
// Auth 管理邏輯（註冊 / 登入）

import { saveUser, getUser, User } from "../lib/auth/userStore";

export function register(username: string, password: string): string | null {
  if (!username || !password) return "請輸入完整資訊";

  const existing = getUser();
  if (existing) return "已存在使用者，請直接登入";

  const newUser: User = {
    username,
    password,
    tier: "FREE+"
  };

  saveUser(newUser);
  return null;
}

export function login(username: string, password: string): string | null {
  const user = getUser();
  if (!user) return "尚未註冊";

  if (user.username !== username || user.password !== password)
    return "帳號或密碼錯誤";

  return null;
}

export function getCurrentUser(): User | null {
  return getUser();
}
