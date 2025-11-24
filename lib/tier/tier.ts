export type Tier = "FREE" | "PRO" | "MASTER";

export const DEFAULT_TIER: Tier = "FREE";

export function readTierFromStorage(): Tier {
  if (typeof window === "undefined") return DEFAULT_TIER;
  const saved = window.localStorage.getItem("gto_master_tier");
  if (saved === "PRO" || saved === "MASTER" || saved === "FREE") return saved;
  return DEFAULT_TIER;
}

export function writeTierToStorage(tier: Tier) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("gto_master_tier", tier);
}

export function maxChapterByTier(tier: Tier): number {
  if (tier === "MASTER") return 50;
  if (tier === "PRO") return 30;
  return 5; // FREE
}
