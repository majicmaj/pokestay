import { TYPE_CHART } from "../constants/typeChart";

export const calculateTypeAdvantage = (
  attackerTypes: string[],
  defenderTypes: string[]
): number => {
  let multiplier = 1;

  if (!attackerTypes?.length || !defenderTypes?.length) {
    return multiplier;
  }

  attackerTypes.forEach((attackerType) => {
    // Ensure the type exists in our chart
    if (!attackerType || !(attackerType in TYPE_CHART)) return;

    const chart = TYPE_CHART[attackerType as keyof typeof TYPE_CHART];
    if (!chart) return;

    defenderTypes.forEach((defenderType) => {
      if (!defenderType) return;
      if (chart.weakTo?.includes(defenderType)) multiplier *= 1.5;
      // if (attackerType !== 'normal' && chart.resistantTo?.includes(defenderType as never)) multiplier *= 0.75;
      // if ('immuneTo' in chart && chart?.immuneTo?.includes(defenderType)) multiplier *= 0.5;
    });
  });

  return multiplier;
};
