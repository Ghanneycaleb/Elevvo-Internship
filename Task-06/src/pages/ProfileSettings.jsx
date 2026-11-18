import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import PageHeading from '../components/PageHeading.jsx'
import { profile } from '../data/mockData.js'

const initialForm = {
  name: profile.name,
  email: profile.email,
  newPassword: '',
  confirmPassword: '',
}

export default function ProfileSettings() {
  const [form, setForm] = useState(initialForm)
  const [savedForm, setSavedForm] = useState(initialForm)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setSuccess(false)
  }

  function cancelEdit() {
    setForm(savedForm)
    setEditing(false)
    setError('')
    setSuccess(false)
  }

  function saveProfile(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim()) {
      setError('Enter your name and email address before saving.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    if (
      form.newPassword &&
      (form.newPassword.length < 8 || form.newPassword !== form.confirmPassword)
    ) {
      setError(
        form.newPassword.length < 8
          ? 'A new password must be at least 8 characters.'
          : 'The password fields do not match.',
      )
      return
    }

    const updated = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      newPassword: '',
      confirmPassword: '',
    }
    setForm(updated)
    setSavedForm(updated)
    setEditing(false)
    setSuccess(true)
    setError('')
  }

  const fields = [
    { label: 'Full name', name: 'name', type: 'text', autoComplete: 'name' },
    { label: 'Email address', name: 'email', type: 'email', autoComplete: 'email' },
  ]

  return (
    <>
      <PageHeading
        description="Manage the personal details clients see when working with you."
        eyebrow="Your account"
        title="Profile settings"
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
        <form
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-7"
          noValidate
          onSubmit={saveProfile}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-sm font-bold text-amber-800">
                JL
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{savedForm.name}</p>
                <p className="mt-1 text-xs text-slate-500">Independent designer</p>
              </div>
            </div>
            {!editing && (
              <button
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setEditing(true)
                  setSuccess(false)
                }}
                type="button"
              >
                <Icon className="h-3.5 w-3.5" name="edit" />
                Edit profile
              </button>
            )}
          </div>

          <div className="grid gap-5 py-6 sm:grid-cols-2">
            {fields.map((field) => (
              <label className="block" htmlFor={field.name} key={field.name}>
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  {field.label}
                </span>
                <input
                  autoComplete={field.autoComplete}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500"
                  disabled={!editing}
                  id={field.name}
                  name={field.name}
                  onChange={updateField}
                  required
                  type={field.type}
                  value={form[field.name]}
                />
              </label>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="mb-4 flex items-center gap-2">
              <Icon className="h-4 w-4 text-slate-400" name="lock" />
              <h2 className="text-xs font-semibold text-slate-800">Password</h2>
            </div>
            {editing ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block" htmlFor="newPassword">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">
                    New password
                  </span>
                  <input
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    id="newPassword"
                    name="newPassword"
                    onChange={updateField}
                    placeholder="Leave blank to keep current"
                    type="password"
                    value={form.newPassword}
                  />
                </label>
                <label className="block" htmlFor="confirmPassword">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">
                    Confirm new password
                  </span>
                  <input
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={updateField}
                    placeholder="Re-enter new password"
                    type="password"
                    value={form.confirmPassword}
                  />
                </label>
              </div>
            ) : (
              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-700">
                  Current password
                </span>
                <input
                  aria-label="Password is hidden"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm tracking-[0.25em] text-slate-500 sm:max-w-[calc(50%-10px)]"
                  disabled
                  type="password"
                  value="password"
                  readOnly
                />
              </div>
            )}
          </div>

          {(error || success) && (
            <p
              aria-live="polite"
              className={`mt-5 rounded-xl px-3.5 py-3 text-xs ${
                error
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
              role={error ? 'alert' : 'status'}
            >
              {error || 'Your changes were saved locally for this session.'}
            </p>
          )}

          {editing && (
            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
              <button
                className="h-10 rounded-xl px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                onClick={cancelEdit}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-10 rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700"
                type="submit"
              >
                Save changes
              </button>
            </div>
          )}
        </form>

        <aside
          aria-labelledby="profile-note-title"
          className="h-fit rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-6"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-700 shadow-sm">
            <Icon className="h-5 w-5" name="user" />
          </span>
          <h2 className="mt-4 text-sm font-semibold text-slate-900" id="profile-note-title">
            Your profile, your way
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Keep your contact details current so clients know how to reach you.
            Changes in this demo stay in local page state only.
          </p>
          <div className="mt-5 rounded-xl border border-indigo-100 bg-white/80 p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Profile completeness
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full w-[85%] rounded-full bg-indigo-500" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-indigo-700">85% complete</p>
          </div>
        </aside>
      </div>
    </>
  )
}
