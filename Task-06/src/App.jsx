import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'

const Overview = lazy(() => import('./pages/Overview.jsx'))
const ProfileSettings = lazy(() => import('./pages/ProfileSettings.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoading />}>
                <Overview />
              </Suspense>
            }
          />
          <Route
            path="projects"
            element={
              <Suspense fallback={<PageLoading />}>
                <Projects />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageLoading />}>
                <ProfileSettings />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function PageLoading() {
  return (
    <p aria-live="polite" className="py-16 text-center text-sm text-slate-500" role="status">
      Loading page…
    </p>
  )
}
