import utgData from "./utg.json";
import hjData from "./hj.json";
import coData from "./co.json";
import btnData from "./btn.json";
import sbData from "./sb.json";
import bbData from "./bb.json";
import type { ComboFreq, PositionKey } from "./types";

export const positionRangeMap: Record<PositionKey, Record<string, ComboFreq>> = {
  UTG: utgData as Record<string, ComboFreq>,
  HJ: hjData as Record<string, ComboFreq>,
  CO: coData as Record<string, ComboFreq>,
  BTN: btnData as Record<string, ComboFreq>,
  SB: sbData as Record<string, ComboFreq>,
  BB: bbData as Record<string, ComboFreq>,
};
