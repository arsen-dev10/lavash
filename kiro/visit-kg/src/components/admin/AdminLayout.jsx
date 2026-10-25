import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import AdminToast from './AdminToast'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { reviews } = useApp()
  const [sideOpen, setSideOpen] = useState(false)
  const user = localStorage.getItem('kg_admin_user') || 'admin'
  const userReviews = reviews.filter(r => !r.isDefault).length

  const logout = () => {
    localStorage.removeItem('kg_admin_auth')
    localStorage.removeItem('kg_admin_login_time')
    navigate('/admin/login')
  }

  const menuItems = [
    { section: 'Главное' },
    { to: '/admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Дашборд' },
    { section: 'Контент' },
    { to: '/admin/places',  icon: 'fas fa-map-marker-alt', label: 'Места' },
    { to: '/admin/routes',  icon: 'fas fa-route', label: 'Маршруты' },
    { to: '/admin/reviews', icon: 'fas fa-star', label: 'Отзывы', badge: userReviews > 0 ? userReviews : null },
    { section: 'Система' },
    { to: '/admin/settings', icon: 'fas fa-cog', label: 'Настройки' },
    { href: '/', icon: 'fas fa-external-link-alt', label: 'Открыть сайт', blank: true },
    { action: logout, icon: 'fas fa-sign-out-alt', label: 'Выход' },
  ]

  return (
    <div className="admin-layout">
      {sideOpen && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:199}} onClick={() => setSideOpen(false)}></div>}

      <aside className={`admin-sidebar${sideOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-logo">
          <i className="fas fa-mountain"></i>
          <div><span>VisitKyrgyzstan</span><small>Admin Panel</small></div>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item, i) => {
            if (item.section) return <div key={i} className="menu-section">{item.section}</div>
            if (item.action) return (
              <button key={i} className="menu-item" onClick={item.action} style={{width:'100%',textAlign:'left',background:'none',border:'none'}}>
                <i className={item.icon}></i> {item.label}
              </button>
            )
            if (item.href) return (
              <a key={i} href={item.href} className="menu-item" target={item.blank?'_blank':undefined} rel="noopener noreferrer">
                <i className={item.icon}></i> {item.label}
              </a>
            )
            return (
              <NavLink key={i} to={item.to} className={({isActive}) => `menu-item${isActive?' active':''}`} onClick={() => setSideOpen(false)}>
                <i className={item.icon}></i> {item.label}
                {item.badge && <span className="menu-badge green">{item.badge}</span>}
              </NavLink>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <strong>{user}</strong>
          Последний вход: {new Date(parseInt(localStorage.getItem('kg_admin_login_time')||0)).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-left">
            <button style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.05rem',color:'var(--gray)'}} onClick={() => setSideOpen(o=>!o)}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div className="topbar-right">
            <a href="/" target="_blank" rel="noopener noreferrer" className="topbar-link"><i className="fas fa-globe"></i> Открыть сайт</a>
            <div className="topbar-user">
              <div className="topbar-avatar">{user.charAt(0).toUpperCase()}</div>
              <span>{user}</span>
            </div>
            <button className="topbar-logout" onClick={logout}><i className="fas fa-sign-out-alt"></i> Выход</button>
          </div>
        </div>
        <div style={{flex:1}}>
          <Outlet />
        </div>
      </div>

      <AdminToast />
    </div>
  )
}
