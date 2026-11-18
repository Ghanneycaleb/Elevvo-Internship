import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

function formatToday() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date())
}

export default function Header({
  collapsed,
  mobileOpen,
  notificationArea,
  notificationButton,
  notificationsOpen,
  activities,
  onToggleCollapse,
  onToggleMobile,
  onToggleNotifications,
  pageTitle,
  mobileMenuButton,
  unread,
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={onToggleMobile}
          ref={mobileMenuButton}
          type="button"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} />
        </button>
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 md:grid"
          onClick={onToggleCollapse}
          type="button"
        >
          <Icon className="h-[18px] w-[18px]" name="menu" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 sm:text-[15px]">
            {pageTitle}
          </p>
          <p className="hidden text-[11px] text-slate-500 sm:block">
            Welcome back, Jordan
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <span className="hidden text-xs font-medium text-slate-500 sm:block">
          {formatToday()}
        </span>
        <div className="relative" ref={notificationArea}>
          <button
            aria-expanded={notificationsOpen}
            aria-haspopup="dialog"
            aria-label={`Notifications${unread ? ', unread updates' : ''}`}
            aria-controls="recent-notifications"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm shadow-slate-100 hover:bg-slate-50"
            onClick={onToggleNotifications}
            ref={notificationButton}
            type="button"
          >
            <Icon className="h-[18px] w-[18px]" name="notification" />
            {unread && (
              <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            )}
          </button>

          {notificationsOpen && (
            <section
              aria-label="Recent notifications"
              className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
              id="recent-notifications"
              role="dialog"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Your latest activity</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                  3 recent
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {activities.map((activity) => {
                  const toneClass = {
                    green: 'bg-emerald-50 text-emerald-700',
                    blue: 'bg-sky-50 text-sky-700',
                    violet: 'bg-violet-50 text-violet-700',
                  }[activity.tone]
                  const iconName = {
                    green: 'dollar',
                    blue: 'activity',
                    violet: 'user',
                  }[activity.tone]

                  return (
                  <li className="flex gap-3 px-4 py-3.5" key={activity.id}>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClass}`}
                    >
                      <Icon className="h-4 w-4" name={iconName} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">{activity.title}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {activity.detail}
                      </p>
                      <p className="mt-1.5 text-[10px] text-slate-400">{activity.time}</p>
                    </div>
                  </li>
                  )
                })}
              </ul>
              <Link
                className="flex items-center justify-center gap-1 border-t border-slate-100 px-4 py-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                onClick={onToggleNotifications}
                to="/"
              >
                View activity <Icon className="h-3.5 w-3.5" name="chevronRight" />
              </Link>
            </section>
          )}
        </div>
        <div className="hidden h-9 w-9 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 sm:grid">
          JL
        </div>
      </div>
    </header>
  )
}
