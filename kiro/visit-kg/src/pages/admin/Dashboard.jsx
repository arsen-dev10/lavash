import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const CAT_LABELS = {lake:'Озёра',gorge:'Ущелья',canyon:'Каньоны',forest:'Леса',culture:'Культура',city:'Города',mountain:'Горы'}
const CAT_COLORS = {lake:'blue',gorge:'green',canyon:'orange',forest:'green',culture:'amber',city:'blue',mountain:'purple'}

export default function Dashboard() {
  const { places, routes, reviews, saved } = useApp()
  const total = reviews.length
  const avg = total ? (reviews.reduce((s,r)=>s+r.rating,0)/total).toFixed(1) : '—'
  const fiveStar = reviews.filter(r=>r.rating===5).length
  const userReviews = reviews.filter(r=>!r.isDefault)
  const catCount = {}
  places.forEach(p => { catCount[p.cat]=(catCount[p.cat]||0)+1 })

  return (
    <div className="admin-body">
      <div className="admin-page-header">
        <div><h1>Добро пожаловать! 👋</h1><p>Обзор состояния туристического каталога</p></div>
        <div style={{display:'flex',gap:'.65rem'}}>
          <Link to="/admin/places" className="btn-admin btn-admin-primary"><i className="fas fa-plus"></i> Добавить место</Link>
          <Link to="/admin/routes" className="btn-admin btn-admin-outline"><i className="fas fa-plus"></i> Добавить маршрут</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="admin-stats">
        {[
          {icon:'fas fa-map-marker-alt',cls:'blue',val:places.length,label:'Мест в каталоге',sub:`${places.filter(p=>p.status==='active').length} активных`},
          {icon:'fas fa-route',cls:'green',val:routes.length,label:'Маршрутов',sub:''},
          {icon:'fas fa-star',cls:'amber',val:total,label:'Отзывов',sub:`★ Средний: ${avg}`},
          {icon:'fas fa-bookmark',cls:'purple',val:saved.length,label:'Сохранений пользователей',sub:''},
        ].map(s => (
          <div key={s.label} className="a-stat">
            <div className={`a-stat-icon ${s.cls}`}><i className={s.icon}></i></div>
            <div className="a-stat-info">
              <strong>{s.val}</strong>
              <span>{s.label}</span>
              {s.sub && <div className="a-stat-change">{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-2col">
        {/* ПОСЛЕДНИЕ ОТЗЫВЫ */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2><i className="fas fa-comments"></i> Последние отзывы</h2>
            <Link to="/admin/reviews" className="btn-admin btn-admin-ghost btn-sm" style={{fontSize:'.78rem'}}>Все отзывы</Link>
          </div>
          <div style={{padding:0}}>
            {reviews.slice(0,5).map(r => (
              <div key={r.id} style={{display:'flex',alignItems:'flex-start',gap:'.75rem',padding:'.85rem 1.4rem',borderBottom:'1px solid #f1f5f9'}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.88rem',flexShrink:0}}>
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'.5rem'}}>
                    <strong style={{fontSize:'.86rem'}}>{r.name}</strong>
                    <span className="a-stars">{'★'.repeat(r.rating)}</span>
                  </div>
                  <div style={{fontSize:'.76rem',color:'var(--gray)',marginBottom:'.25rem'}}>📍 {r.place}</div>
                  <div style={{fontSize:'.8rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:220}}>{r.text.slice(0,80)}...</div>
                </div>
              </div>
            ))}
            {reviews.length === 0 && <div className="empty-state"><i className="fas fa-comment-slash"></i><p>Отзывов пока нет</p></div>}
          </div>
        </div>

        {/* КАТЕГОРИИ */}
        <div className="admin-card">
          <div className="admin-card-header"><h2><i className="fas fa-chart-bar"></i> Места по категориям</h2></div>
          <div className="admin-card-body">
            <div className="progress-row">
              {Object.entries(catCount).map(([cat, cnt]) => (
                <div key={cat} className="progress-item">
                  <div className="progress-label"><span>{CAT_LABELS[cat]||cat}</span><span>{cnt}</span></div>
                  <div className="progress-bar-wrap">
                    <div className={`progress-bar ${CAT_COLORS[cat]||'blue'}`} style={{width:`${Math.round(cnt/places.length*100)}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* БЫСТРЫЕ ДЕЙСТВИЯ */}
        <div className="admin-card">
          <div className="admin-card-header"><h2><i className="fas fa-bolt"></i> Быстрые действия</h2></div>
          <div className="admin-card-body">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.7rem'}}>
              {[['fas fa-map-marker-alt','/admin/places','Управление местами'],['fas fa-route','/admin/routes','Управление маршрутами'],['fas fa-star','/admin/reviews','Отзывы'],['fas fa-cog','/admin/settings','Настройки']].map(([icon,to,label]) => (
                <Link key={to} to={to} className="btn-admin btn-admin-outline" style={{justifyContent:'center'}}>
                  <i className={icon}></i> {label}
                </Link>
              ))}
              <a href="/" target="_blank" rel="noopener noreferrer" className="btn-admin btn-admin-ghost" style={{justifyContent:'center',gridColumn:'1/-1'}}>
                <i className="fas fa-external-link-alt"></i> Открыть сайт в новой вкладке
              </a>
            </div>
          </div>
        </div>

        {/* АКТИВНОСТЬ */}
        <div className="admin-card">
          <div className="admin-card-header"><h2><i className="fas fa-history"></i> Статистика</h2></div>
          <div className="admin-card-body" style={{padding:'0 1.4rem'}}>
            <div className="activity-feed">
              {[
                {icon:'fas fa-map-marker-alt',cls:'blue',text:`Мест в каталоге: <strong>${places.length}</strong>`,time:'Всего'},
                {icon:'fas fa-star',cls:'orange',text:`Отзывов получено: <strong>${total}</strong>`,time:'Всего'},
                {icon:'fas fa-thumbs-up',cls:'green',text:`Отзывов 5★: <strong>${fiveStar}</strong>`,time:'Всего'},
                {icon:'fas fa-user',cls:'blue',text:`Пользовательских отзывов: <strong>${userReviews.length}</strong>`,time:'Всего'},
                {icon:'fas fa-bookmark',cls:'orange',text:`Мест сохранено: <strong>${saved.length}</strong>`,time:'Всего'},
              ].map((a,i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-dot ${a.cls}`}><i className={a.icon}></i></div>
                  <div className="activity-text">
                    <strong dangerouslySetInnerHTML={{__html:a.text}}></strong>
                    <span>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
