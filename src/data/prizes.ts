/**
 * The prize pot is a share of the entry fees, so it grows with every team that
 * enters. Changing `poolShare` or `split` here changes every figure the site
 * quotes — nothing is written out by hand.
 */
export interface PrizeModel {
  /** Fraction of the collected entry fees that goes back out as prizes. */
  poolShare: number
  /** How the pot divides, first place first. Must add up to 1. */
  split: number[]
  /** Entry counts shown in the published table. */
  sampleTeamCounts: number[]
}

export const prizeModel: PrizeModel = {
  poolShare: 0.6,
  split: [0.7, 0.3],
  sampleTeamCounts: [8, 12, 16, 20, 25],
}

/** Total pot for a given number of entries, rounded down to whole lari. */
export function prizePool(teams: number, fee: number, model: PrizeModel = prizeModel): number {
  return Math.floor(teams * fee * model.poolShare)
}

/** The pot split into places, first place first. */
export function prizeBreakdown(
  teams: number,
  fee: number,
  model: PrizeModel = prizeModel,
): number[] {
  const pool = prizePool(teams, fee, model)
  return model.split.map((share) => Math.floor(pool * share))
}

/** `1 575` rather than `1575`, so four-figure sums stay readable. */
export function formatLari(amount: number): string {
  return amount.toLocaleString('en-US').replace(/,/g, ' ')
}
