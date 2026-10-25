import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children }) {
  const isAuth = localStorage.getItem('kg_admin_auth') === 'true'
  const loginTime = parseInt(localStorage.getItem('kg_admin_login_time') || '0')
  const expired = Date.now() - loginTime > 8 * 3600 * 1000

  if (!isAuth || expired) {
    localStorage.removeItem('kg_admin_auth')
    return <Navigate to="/admin/login" replace />
  }
  return children
}
