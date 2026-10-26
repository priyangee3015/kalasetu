import { useMemo, useState } from 'react'
import { SessionContext } from './sessionContext'

const SESSION_KEY = 'kalasetu-demo-session'
const validRoles = ['artisan', 'freelancer', 'customer']

function readDemoSession() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SESSION_KEY))
    if (value?.user?.name && value?.user?.email && validRoles.includes(value.role)) {
      return { ...value, user: { ...value.user, id: value.user.id || value.user.name.trim().toLowerCase() } }
    }
  } catch {
    // Storage may be unavailable; the demo still works for the current page session.
  }
  return null
}

function writeDemoSession(value) {
  try {
    if (value) window.localStorage.setItem(SESSION_KEY, JSON.stringify(value))
    else window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // Browser storage is optional and is not a backend or secure session store.
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(readDemoSession)
  const value = useMemo(() => ({
    session,
    isLoggedIn: Boolean(session),
    role: session?.role ?? null,
    signIn(user, role) {
      if (!validRoles.includes(role)) return
      // Stable browser-demo identity lets a user return to their own collaboration posts after signing out.
      const id = `demo-${String(user.email || '').trim().toLowerCase()}`
      const nextSession = { user: { ...user, id }, role }
      writeDemoSession(nextSession)
      setSession(nextSession)
    },
    signOut() {
      writeDemoSession(null)
      setSession(null)
    },
    updateUser(updates) {
      if (!session) return false
      const nextSession = { ...session, user: { ...session.user, ...updates } }
      writeDemoSession(nextSession)
      setSession(nextSession)
      return true
    },
  }), [session])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
