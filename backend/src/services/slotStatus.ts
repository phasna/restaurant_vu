import type { SlotStatus } from "../dtos";

export function computeSlotStatus(
  bookedCovers: number,
  totalCapacity: number
): SlotStatus {
  if (totalCapacity <= 0) return "free";
  if (bookedCovers >= totalCapacity) return "full";
  const ratio = bookedCovers / totalCapacity;
  if (ratio >= 0.5) return "nearly_full";
  return "free";
}
