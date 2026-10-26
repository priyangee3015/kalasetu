import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '../context/useSession'
import { dashboardForRole } from '../routes/roleRoutes'

export default function RequireRole({ role, children }) {
  const { session, role: currentRole } = useSession()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  if (role && currentRole !== role) return <Navigate to={dashboardForRole(currentRole)} replace />
  return children
}
