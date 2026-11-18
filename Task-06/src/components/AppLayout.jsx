import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { activities, profile } from '../data/mockData.js'
import Header from './Header.jsx'
import Icon from './Icon.jsx'

const navigation = [
  { label: 'Overview', to: '/', icon: 'dashboard', end: true },
  { label: 'Projects', to: '/projects', icon: 'briefcase' },
  { label: 'Profile Settings', to: '/settings', icon: 'settings' },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia('(max-width: 767px)').matches,
  )
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const notificationArea = useRef(null)
  const notificationButton = useRef(null)
  const mobileMenuButton = useRef(null)
  const firstNavigationLink = useRef(null)
  const location = useLocation()
  const pageTitle =
    navigation.find((item) => item.to === location.pathname)?.label ?? 'Overview'

  useEffect(() => {
    setMobileOpen(false)
    setNotificationsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (mobileOpen) firstNavigationLink.current?.focus()
  }, [mobileOpen])

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 767px)')
    const handleBreakpointChange = (event) => {
      setIsMobile(event.matches)
      setMobileOpen(false)
      if (event.matches) setCollapsed(false)
    }

    breakpoint.addEventListener('change', handleBreakpointChange)
    return () => breakpoint.removeEventListener('change', handleBreakpointChange)
  }, [])

  useEffect(() => {
    function handlePointerDown(event) {
      if (!notificationArea.current?.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setNotificationsOpen(false)
        if (mobileOpen) {
          setMobileOpen(false)
          mobileMenuButton.current?.focus()
        } else if (notificationsOpen) {
          notificationButton.current?.focus()
        }
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen, notificationsOpen])

  function toggleNotifications() {
    setNotificationsOpen((open) => {
      if (!open) setUnread(false)
      return !open
    })
  }

  function toggleMobileNavigation() {
    if (mobileOpen) {
      setMobileOpen(false)
      mobileMenuButton.current?.focus()
      return
    }

    setCollapsed(false)
    setMobileOpen(true)
  }

  function closeMobileNavigation() {
    setMobileOpen(false)
    mobileMenuButton.current?.focus()
  }

  return (
    <div className="min-h-screen">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          onClick={closeMobileNavigation}
          type="button"
        />
      )}

      <aside
        aria-label="Main navigation"
        aria-hidden={isMobile && !mobileOpen}
        className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-open' : ''} fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white px-4 py-6`}
        inert={isMobile && !mobileOpen}
      >
        <div className="flex h-11 items-center gap-3 px-1">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm shadow-indigo-200">
            S
          </div>
          <div className="sidebar-brand-text min-w-0 flex-1">
            <p className="truncate text-sm font-bold tracking-tight text-slate-900">
              StudioDesk
            </p>
            <p className="truncate text-xs text-slate-500">Freelance workspace</p>
          </div>
          <button
            aria-label="Close navigation"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={closeMobileNavigation}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <p className="sidebar-label mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Workspace
        </p>
        <nav aria-label="Workspace pages" className="grid gap-1">
          {navigation.map((item) => (
            <NavLink
              aria-label={item.label}
              className={({ isActive }) =>
                `sidebar-link group flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
              end={item.end}
              key={item.to}
              onClick={closeMobileNavigation}
              ref={item.to === '/' ? firstNavigationLink : undefined}
              title={collapsed ? item.label : undefined}
              to={item.to}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" name={item.icon} />
              <span className="sidebar-label truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom mt-auto flex items-center gap-3 border-t border-slate-100 px-2 pt-5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
            {profile.initials}
          </div>
          <div className="sidebar-profile-copy min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">{profile.name}</p>
            <p className="truncate text-[11px] text-slate-500">{profile.role}</p>
          </div>
        </div>
      </aside>

      <div className={`main-panel min-h-screen ${collapsed ? 'is-expanded' : ''}`}>
        <Header
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          notificationArea={notificationArea}
          notificationButton={notificationButton}
          notificationsOpen={notificationsOpen}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          onToggleMobile={toggleMobileNavigation}
          onToggleNotifications={toggleNotifications}
          pageTitle={pageTitle}
          activities={activities}
          mobileMenuButton={mobileMenuButton}
          unread={unread}
        />
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-7 sm:px-6 lg:px-10 lg:pt-9">
          <Outlet context={{ activities }} />
        </main>
      </div>
    </div>
  )
}
