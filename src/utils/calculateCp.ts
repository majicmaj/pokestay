type Stats = Record<string, any>

export function calculateCP(stats: Stats) {
  const { hp, attack, defense, speed } = stats || {};

  const cp = Math.floor(
    (Math.max(10, 0.84 * Math.sqrt((hp * attack * defense * speed)) / 100)
    ))
  return cp;
}