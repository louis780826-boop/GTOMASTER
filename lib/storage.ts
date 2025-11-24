export const NICKNAME_STORAGE_KEY = "gtoMasterNickname";

export function saveNickname(nickname: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
}

export function loadNickname(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(NICKNAME_STORAGE_KEY);
}
