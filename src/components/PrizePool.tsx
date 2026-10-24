import { formatLari, prizeBreakdown, prizeModel, prizePool } from '@/data/prizes'
import { useI18n } from '@/lib/i18n'
import type { Tournament } from '@/types'

/** What the winners take, worked out from how many teams have entered. */
export function PrizePool({ tournament }: { tournament: Tournament }) {
  const { t } = useI18n()
  const fee = tournament.fee ?? 0
  if (!fee) return null

  const rows = prizeModel.sampleTeamCounts
    .filter((teams) => !tournament.slots || teams <= tournament.slots)
    .map((teams) => ({
      teams,
      pool: prizePool(teams, fee),
      places: prizeBreakdown(teams, fee),
    }))

  const best = rows.at(-1)

  return (
    <div className="overflow-hidden rounded-card border border-line bg-paper">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line bg-[var(--accent-soft)] px-5 py-5">
        <div>
          <p className="text-xs font-bold tracking-wide text-slate uppercase">
            {t('prize.label')}
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {best ? `${formatLari(best.pool)} ₾` : '—'}
          </p>
        </div>
        <p className="max-w-sm text-sm text-graphite">{t('prize.lede')}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-sm">
          <thead>
            <tr className="text-xs text-slate">
              <th className="py-3 pl-5 text-left font-semibold">{t('prize.teams')}</th>
              <th className="py-3 text-right font-semibold">{t('prize.pool')}</th>
              <th className="py-3 text-right font-semibold">{t('prize.first')}</th>
              <th className="py-3 pr-5 text-right font-semibold">{t('prize.second')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.teams} className="border-t border-line">
                <td className="py-3 pl-5 font-semibold tabular-nums">{row.teams}</td>
                <td className="py-3 text-right tabular-nums">{formatLari(row.pool)} ₾</td>
                <td className="py-3 text-right font-bold tabular-nums">
                  {formatLari(row.places[0] ?? 0)} ₾
                </td>
                <td className="py-3 pr-5 text-right tabular-nums">
                  {formatLari(row.places[1] ?? 0)} ₾
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-line bg-mist px-5 py-3 text-xs text-slate">
        {t('prize.note')}
      </p>
    </div>
  )
}
