import { useOutletContext } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import PageHeading from '../components/PageHeading.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { earnings, projects } from '../data/mockData.js'
import { formatCedis, formatCompactCedis } from '../utils/formatCurrency.js'

function EarningsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">{formatCedis(payload[0].value)}</p>
    </div>
  )
}

export default function Overview() {
  const { activities } = useOutletContext()
  const recentProjects = projects.slice(0, 3)

  return (
    <>
      <PageHeading
        description="A quick look at your freelance business and the work in motion."
        eyebrow="Tuesday, November 17, 2026"
        title="Good morning, Jordan"
      >
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          to="/projects"
        >
          <Icon className="h-4 w-4" name="plus" />
          View projects
        </Link>
      </PageHeading>

      <section aria-label="Business summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon="briefcase"
          label="Total projects"
          note="2 currently in progress"
          tone="indigo"
          trend="+2 this month"
          value="12"
        />
        <StatCard
          icon="dollar"
          label="Earnings this month"
          note="Compared to last month"
          tone="emerald"
          trend="+12.8%"
          value={formatCedis(8420)}
        />
        <StatCard
          icon="calendar"
          label="Tasks due"
          note="Across active projects"
          tone="amber"
          value="5"
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)]">
        <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Monthly earnings</h2>
              <p className="mt-1 text-xs text-slate-500">Your income over the last 12 months</p>
            </div>
            <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">
              2026
            </span>
          </div>
          <div
            aria-label="Bar chart of monthly earnings from January through December 2026"
            className="h-[250px] w-full sm:h-[285px]"
            role="img"
          >
            <ResponsiveContainer height="100%" minHeight={200} minWidth={0} width="100%">
              <BarChart data={earnings} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#eef0f5" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tick={{ fill: '#8b94a7', fontSize: 11 }}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: '#8b94a7', fontSize: 10 }}
                  tickFormatter={formatCompactCedis}
                  tickLine={false}
                  tickMargin={8}
                  width={48}
                />
                <Tooltip content={<EarningsTooltip />} cursor={{ fill: '#f5f6fb' }} />
                <Bar
                  dataKey="earnings"
                  fill="#6875e8"
                  maxBarSize={28}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">
            Earnings range from GH₵3,200 in January to GH₵9,200 in December. October
            earnings are GH₵8,400.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
              <p className="mt-1 text-xs text-slate-500">The latest from your workspace</p>
            </div>
            <Icon className="h-[18px] w-[18px] text-slate-400" name="activity" />
          </div>
          <ul className="space-y-5">
            {activities.map((activity) => (
              <li className="flex gap-3" key={activity.id}>
                <span
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                    activity.tone === 'green'
                      ? 'bg-emerald-50 text-emerald-700'
                      : activity.tone === 'blue'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-violet-50 text-violet-700'
                  }`}
                >
                  <Icon
                    className="h-4 w-4"
                    name={activity.id === 1 ? 'dollar' : activity.id === 2 ? 'activity' : 'user'}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800">{activity.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{activity.detail}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Projects in progress</h2>
            <p className="mt-1 text-xs text-slate-500">Keep an eye on your current client work.</p>
          </div>
          <Link className="text-xs font-semibold text-indigo-700 hover:text-indigo-900" to="/projects">
            All projects <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentProjects.map((project) => (
            <div className="flex flex-wrap items-center justify-between gap-3 py-3.5" key={project.id}>
              <div className="min-w-[180px] flex-1">
                <p className="text-xs font-semibold text-slate-800">{project.name}</p>
                <p className="mt-1 text-[11px] text-slate-500">{project.client}</p>
              </div>
              <StatusBadge status={project.status} />
              <p className="w-28 text-right text-[11px] text-slate-500">{project.deadline}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
