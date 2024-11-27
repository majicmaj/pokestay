import { TYPE_CHART } from "../constants/typeChart";

export const calculateTypeAdvantage = (
  attackerTypes: string[],
  defenderTypes: string[]
): number => {
  let multiplier = 1;

  if (!attackerTypes?.length || !defenderTypes?.length) {
    return multiplier;
  }

  defenderTypes.forEach((defenderType) => {
    // Ensure the type exists in our chart
    if (!defenderType || !(defenderType in TYPE_CHART)) return;

    const chart = TYPE_CHART[defenderType as keyof typeof TYPE_CHART];
    if (!chart) return;

    attackerTypes.forEach((attackerTypes) => {
      if (!attackerTypes) return;
      if (chart.weakTo?.includes(attackerTypes)) multiplier *= 1.6;
    });
  });

  return multiplier;
};
