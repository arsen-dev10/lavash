import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'
import PlaceCard from '../components/PlaceCard'

export default function Places() {
  const { lang, places } = useApp()
  const t = T[lang]
  const [filter, setFilter] = useState('all')

  const filters = [
    ['all', t.filter_all], ['lake', t.filter_lake], ['gorge', t.filter_gorge],
    ['canyon', t.filter_canyon], ['culture', t.filter_culture],
    ['forest', t.filter_forest], ['city', t.filter_city],
  ]

  const visible = places.filter(p => p.status === 'active' && (filter === 'all' || p.cat === filter))

  return (
    <>
      <section className="page-hero" style={{backgroundImage:"url('https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1400')"}}>
        <div className="page-hero-bg"></div>
        <div className="page-hero-content">
          <h1><i className="fas fa-map-marker-alt"></i> {t.places_title}</h1>
          <p>{t.places_sub}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">{t.nav_home}</a>
            <i className="fas fa-chevron-right"></i>
            <span>{t.nav_places}</span>
          </div>

          <div className="filter-bar">
            {filters.map(([val, label]) => (
              <button key={val} className={`filter-btn${filter===val?' active':''}`} onClick={() => setFilter(val)}>
                {label}
              </button>
            ))}
            <span style={{fontSize:'.82rem',color:'var(--gray)',marginLeft:'auto'}}>
              {lang==='ky'?`Табылды: ${visible.length}`:lang==='en'?`Found: ${visible.length}`:`Найдено: ${visible.length}`}
            </span>
          </div>

          {visible.length > 0 ? (
            <div className="places-grid">
              {visible.map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--gray)'}}>
              <i className="fas fa-map-marker-slash" style={{fontSize:'3rem',opacity:.25,display:'block',marginBottom:'1rem'}}></i>
              <p>{lang==='en'?'No places found':lang==='ky'?'Жерлер табылган жок':'Места не найдены'}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
