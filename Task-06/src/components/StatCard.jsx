import Icon from './Icon.jsx'

const tones = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
}

export default function StatCard({ label, value, note, icon, tone, trend }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-[27px] font-bold tracking-tight text-slate-900 sm:text-[30px]">
            {value}
          </p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${tones[tone]}`}>
          <Icon className="h-[18px] w-[18px]" name={icon} />
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
        {trend && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <Icon className="h-3.5 w-3.5" name="trend" />
            {trend}
          </span>
        )}
        <span className="text-[11px] text-slate-400">{note}</span>
      </div>
    </article>
  )
}
