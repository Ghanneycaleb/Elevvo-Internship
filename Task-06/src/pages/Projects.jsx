import { useMemo, useState } from 'react'
import PageHeading from '../components/PageHeading.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { projects } from '../data/mockData.js'
import { formatCedis } from '../utils/formatCurrency.js'

const filters = ['All projects', 'In Progress', 'Pending', 'Completed']

export default function Projects() {
  const [filter, setFilter] = useState('All projects')
  const visibleProjects = useMemo(
    () =>
      filter === 'All projects'
        ? projects
        : projects.filter((project) => project.status === filter),
    [filter],
  )

  return (
    <>
      <PageHeading
        description="Track your client work, project timelines, and deliverables."
        eyebrow="Your work"
        title="Projects"
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">All client projects</h2>
            <p className="mt-1 text-xs text-slate-500">
              {visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
          <div aria-label="Filter projects by status" className="flex flex-wrap gap-1.5" role="group">
            {filters.map((option) => (
              <button
                aria-pressed={filter === option}
                className={`rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors ${
                  filter === option
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                key={option}
                onClick={() => setFilter(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[740px] text-left">
            <thead className="bg-slate-50/70">
              <tr className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5" scope="col">Project</th>
                <th className="px-5 py-3.5" scope="col">Status</th>
                <th className="px-5 py-3.5" scope="col">Deadline</th>
                <th className="px-5 py-3.5" scope="col">Budget</th>
                <th className="px-5 py-3.5" scope="col">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleProjects.map((project) => (
                <tr className="hover:bg-slate-50/60" key={project.id}>
                  <th className="px-5 py-4 font-normal" scope="row">
                    <p className="text-xs font-semibold text-slate-800">{project.name}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{project.client}</p>
                  </th>
                  <td className="px-5 py-4"><StatusBadge status={project.status} /></td>
                  <td className="px-5 py-4 text-xs text-slate-600">{project.deadline}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                    {formatCedis(project.budget)}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{project.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-slate-100 md:hidden">
          {visibleProjects.map((project) => (
            <li className="p-4" key={project.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-800">{project.name}</h3>
                  <p className="mt-1 text-[11px] text-slate-500">{project.client}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div className="mt-4 flex flex-wrap justify-between gap-3 text-[11px]">
                <span className="text-slate-500">
                  Deadline <strong className="ml-1 font-medium text-slate-700">{project.deadline}</strong>
                </span>
                <span className="font-semibold text-slate-700">{formatCedis(project.budget)}</span>
              </div>
              <p className="mt-2 text-[10px] text-slate-400">{project.type}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
