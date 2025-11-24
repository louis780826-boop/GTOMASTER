"use client";

import { useEffect, useState } from "react";
import { Tier, DEFAULT_TIER, readTierFromStorage, writeTierToStorage } from "./tier";

export function useTier() {
  const [tier, setTierState] = useState<Tier>(DEFAULT_TIER);

  useEffect(() => {
    const t = readTierFromStorage();
    setTierState(t);
  }, []);

  const setTier = (t: Tier) => {
    setTierState(t);
    writeTierToStorage(t);
  };

  return { tier, setTier };
}
