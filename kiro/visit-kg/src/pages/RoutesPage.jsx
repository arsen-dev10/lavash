import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'
import { Link } from 'react-router-dom'

const TRANSPORT_TABLE = [
  {dest:'Иссык-Куль (Чолпон-Ата)',type:'fas fa-bus',transport:'Маршрутка',time:'4-5 ч',price:'300-500',from:'Зап. автовокзал'},
  {dest:'Каракол',type:'fas fa-bus',transport:'Маршрутка',time:'6-7 ч',price:'400-600',from:'Зап. автовокзал'},
  {dest:'Нарын',type:'fas fa-bus',transport:'Автобус',time:'7-8 ч',price:'350-500',from:'Ост. автовокзал'},
  {dest:'Ош',type:'fas fa-plane',transport:'Самолёт',time:'1 ч',price:'1500-4000',from:'Аэропорт Манас'},
  {dest:'Ош',type:'fas fa-bus',transport:'Ночной автобус',time:'10-12 ч',price:'500-900',from:'Ост. автовокзал'},
  {dest:'Жалал-Абад',type:'fas fa-bus',transport:'Автобус',time:'9-11 ч',price:'500-800',from:'Ост. автовокзал'},
  {dest:'Талас',type:'fas fa-bus',transport:'Маршрутка',time:'4-5 ч',price:'250-400',from:'Зап. автовокзал'},
]

const DIFF = {easy:'diff-easy',medium:'diff-medium',hard:'diff-hard'}
const DIFF_LABELS = {easy:{ru:'Лёгкий',en:'Easy',ky:'Жеңил'},medium:{ru:'Средний',en:'Medium',ky:'Орто'},hard:{ru:'Сложный',en:'Hard',ky:'Кыйын'}}
const TYPE_LABELS = {trek:{ru:'Треккинг',en:'Trekking',ky:'Треккинг'},horse:{ru:'Конный',en:'Horse',ky:'Атчан'},climb:{ru:'Альпинизм',en:'Climbing',ky:'Альпинизм'},culture:{ru:'Культурный',en:'Cultural',ky:'Маданий'}}

export default function RoutesPage() {
  const { lang, routes } = useApp()
  const t = T[lang]
  const [filter, setFilter] = useState('all')

  const visible = routes.filter(r => r.status === 'active' && (filter === 'all' || r.type === filter || (filter === 'easy' && r.difficulty === 'easy')))

  return (
    <>
      <section className="page-hero" style={{backgroundImage:"url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400')"}}>
        <div className="page-hero-bg"></div>
        <div className="page-hero-content">
          <h1><i className="fas fa-route"></i> {t.routes_title}</h1>
          <p>{t.routes_sub}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">{t.nav_home}</a> <i className="fas fa-chevron-right"></i> <span>{t.nav_routes}</span>
          </div>

          {/* TRANSPORT TABLE */}
          <div className="transport-table">
            <h2 style={{marginBottom:'1.25rem',fontSize:'1.3rem'}}>
              <i className="fas fa-bus" style={{color:'var(--primary)'}}></i> {t.transport_table}
            </h2>
            <table>
              <thead>
                <tr>
                  {[lang==='ky'?'Багыт':lang==='en'?'Destination':'Направление',
                    lang==='ky'?'Транспорт':lang==='en'?'Transport':'Транспорт',
                    lang==='ky'?'Убакыт':lang==='en'?'Time':'Время',
                    lang==='ky'?'Баасы (сом)':lang==='en'?'Price (som)':'Цена (сом)',
                    lang==='ky'?'Кайдан':lang==='en'?'From':'Откуда'
                  ].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {TRANSPORT_TABLE.map((row, i) => (
                  <tr key={i}>
                    <td style={{fontWeight:600}}>{row.dest}</td>
                    <td><i className={row.type} style={{color:'var(--primary)'}}></i> {row.transport}</td>
                    <td>{row.time}</td>
                    <td>{row.price}</td>
                    <td style={{fontSize:'.82rem',color:'var(--gray)'}}>{row.from}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ROUTE FILTERS */}
          <h2 style={{marginBottom:'1rem',fontSize:'1.35rem'}}>{t.routes_title}</h2>
          <div className="filter-bar">
            {[['all',t.filter_all],['trek',t.filter_trek||'Треккинг'],
              ['horse',t.filter_horse||'Конные'],['climb',t.filter_climb||'Альпинизм'],
              ['culture',t.filter_culture||'Культура'],['easy',t.filter_easy||'Лёгкие']
            ].map(([val,label]) => (
              <button key={val} className={`filter-btn${filter===val?' active':''}`} onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>

          <div className="routes-grid">
            {visible.map(r => (
              <div key={r.id} className="route-card">
                <div className="route-img" style={{backgroundImage:`url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600')`}}>
                  <span className={`route-diff ${DIFF[r.difficulty]}`}>{(DIFF_LABELS[r.difficulty]||{})[lang]||r.difficulty}</span>
                </div>
                <div className="route-body">
                  <h3>{r.name}</h3>
                  <div className="route-meta">
                    <span><i className="fas fa-clock"></i> {r.duration}</span>
                    <span><i className="fas fa-ruler-horizontal"></i> {r.distance}</span>
                    <span><i className="fas fa-ruler-vertical"></i> {r.height}</span>
                    <span><i className="fas fa-calendar"></i> {r.season}</span>
                  </div>
                  {r.desc && <p style={{fontSize:'.87rem',color:'var(--gray)',marginBottom:'.75rem'}}>{r.desc}</p>}
                  <div className="route-transport">
                    <h4><i className="fas fa-bus" style={{color:'var(--primary)'}}></i> {t.how_to_get}</h4>
                    <p>{r.transport}</p>
                    <div className="t-icons">
                      <div className="t-icon"><i className="fas fa-tag"></i> {(TYPE_LABELS[r.type]||{})[lang]||r.type}</div>
                    </div>
                  </div>
                  <Link to="/map" className="btn-sm btn-primary-sm"><i className="fas fa-map"></i> {t.btn_map}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
