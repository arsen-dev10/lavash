import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('kg_admin_auth') === 'true') navigate('/admin/dashboard')
  }, [navigate])

  const login = e => {
    e.preventDefault()
    setLoading(true); setError('')
    setTimeout(() => {
      const savedUser = localStorage.getItem('kg_admin_user') || 'admin'
      const savedPass = localStorage.getItem('kg_admin_pass') || 'admin123'
      if (user === savedUser && pass === savedPass) {
        localStorage.setItem('kg_admin_auth', 'true')
        localStorage.setItem('kg_admin_login_time', Date.now())
        navigate('/admin/dashboard')
      } else {
        setError('Неверный логин или пароль')
        setPass('')
        setLoading(false)
      }
    }, 700)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <i className="fas fa-mountain"></i>
          <h1>VisitKyrgyzstan</h1>
          <p>Панель управления сайтом</p>
          <span className="login-badge">ADMIN PANEL</span>
        </div>

        {error && (
          <div className="login-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={login}>
          <div className="admin-form-group">
            <label><i className="fas fa-user" style={{color:'var(--primary)',marginRight:'.35rem'}}></i> Логин</label>
            <input className="admin-form-control" value={user} onChange={e=>setUser(e.target.value)} placeholder="admin" autoComplete="username" required />
          </div>
          <div className="admin-form-group">
            <label><i className="fas fa-lock" style={{color:'var(--primary)',marginRight:'.35rem'}}></i> Пароль</label>
            <div className="pass-wrap">
              <input className="admin-form-control" type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" required style={{paddingRight:'2.5rem'}} />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(s=>!s)}>
                <i className={`fas fa-eye${showPass?'-slash':''}`}></i>
              </button>
            </div>
          </div>
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Проверка...</> : <><i className="fas fa-sign-in-alt"></i> Войти в панель</>}
          </button>
        </form>

        <div className="login-hint">
          <i className="fas fa-info-circle"></i> Логин: <code>admin</code> &nbsp;|&nbsp; Пароль: <code>admin123</code>
        </div>
      </div>
    </div>
  )
}
