import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'

const MAP_POINTS = [
  {name:'Бишкек',type:'culture',desc:'Столица Кыргызстана',lat:42.87,lng:74.59,link:'/places'},
  {name:'Иссык-Куль',type:'lake',desc:'Горное озеро, 6236 км²',lat:42.45,lng:77.0,link:'/places'},
  {name:'Ала-Арча',type:'nature',desc:'Нац. парк, ущелья и водопады',lat:42.55,lng:74.48,link:'/places'},
  {name:'Пик Ленина',type:'mountain',desc:'7134 м — семитысячник',lat:39.73,lng:72.82,link:'/mountains'},
  {name:'Хан-Тенгри',type:'mountain',desc:'6995 м — Повелитель неба',lat:42.21,lng:80.17,link:'/mountains'},
  {name:'Сон-Куль',type:'lake',desc:'Высокогорное озеро, 3016 м',lat:41.82,lng:75.12,link:'/places'},
  {name:'Ош',type:'culture',desc:'Город трёх тысяч лет',lat:40.52,lng:72.79,link:'/places'},
  {name:'Каньон Сказка',type:'nature',desc:'Красные скалы Иссык-Куля',lat:42.50,lng:78.40,link:'/places'},
  {name:'Арстанбап',type:'nature',desc:'Ореховый лес ЮНЕСКО',lat:41.50,lng:72.93,link:'/places'},
  {name:'Сары-Чeлек',type:'lake',desc:'Заповедник ЮНЕСКО',lat:41.77,lng:71.45,link:'/places'},
  {name:'Каракол',type:'mountain',desc:'Горный курорт',lat:42.44,lng:78.95,link:'/routes'},
  {name:'Нарын',type:'culture',desc:'Горный город на Шёлковом пути',lat:41.42,lng:75.99,link:'/places'},
]

const TYPE_COLORS = {mountain:'#3b82f6',lake:'#06b6d4',culture:'#f59e0b',nature:'#22c55e'}

export default function MapPage() {
  const { lang } = useApp()
  const t = T[lang]
  const mapRef = useRef(null)
  const leafletMap = useRef(null)
  const allMarkers = useRef([])
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    if (leafletMap.current) return
    import('leaflet').then(L => {
      const map = L.default.map(mapRef.current).setView([41.5, 75.0], 6)
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap', maxZoom: 18
      }).addTo(map)

      MAP_POINTS.forEach(p => {
        const icon = L.default.divIcon({
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${TYPE_COLORS[p.type]};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
          className: '', iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -10]
        })
        const marker = L.default.marker([p.lat, p.lng], { icon }).addTo(map)
          .bindPopup(`<div style="font-family:Segoe UI,sans-serif;min-width:160px"><strong style="font-size:.95rem">${p.name}</strong><div style="font-size:.8rem;color:#64748b;margin:.3rem 0">${p.desc}</div></div>`)
        marker._type = p.type; marker._name = p.name
        allMarkers.current.push({ marker, type: p.type, name: p.name })
      })
      leafletMap.current = { map, L: L.default }
    })
  }, [])

  const flyTo = (lat, lng, name) => {
    if (!leafletMap.current) return
    const { map } = leafletMap.current
    map.flyTo([lat, lng], 10, { animate: true, duration: 1.2 })
    setTimeout(() => {
      allMarkers.current.find(m => m.name === name)?.marker.openPopup()
    }, 1300)
  }

  const handleFilter = type => {
    setFilterType(type)
    if (!leafletMap.current) return
    const { map } = leafletMap.current
    allMarkers.current.forEach(({ marker, type: t }) => {
      if (type === 'all' || t === type) marker.addTo(map)
      else map.removeLayer(marker)
    })
  }

  return (
    <>
      <section className="page-hero" style={{background:'linear-gradient(135deg,#0f2027,#2c5364)'}}>
        <div className="page-hero-content">
          <h1><i className="fas fa-map"></i> {t.map_title}</h1>
          <p>{t.map_sub}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">{t.nav_home}</a> <i className="fas fa-chevron-right"></i> <span>{t.nav_map}</span>
          </div>

          <div className="filter-bar" style={{marginBottom:'1rem'}}>
            <strong style={{fontSize:'.88rem'}}>{t.show || 'Показать'}:</strong>
            {[['all',t.map_all||'Все'],['mountain','⛰️ '+t.nav_mountains],['lake','🌊 '+(lang==='ky'?'Көлдөр':lang==='en'?'Lakes':'Озёра')],
              ['culture','🏛️ '+(lang==='ky'?'Маданият':lang==='en'?'Culture':'Культура')],['nature','🌲 '+(lang==='ky'?'Табият':lang==='en'?'Nature':'Природа')]
            ].map(([val,label]) => (
              <button key={val} className={`filter-btn${filterType===val?' active':''}`} onClick={() => handleFilter(val)}>{label}</button>
            ))}
          </div>

          <div className="map-wrap">
            <div ref={mapRef} style={{height:'520px',width:'100%'}}></div>
            <div className="map-legend">
              <h3>{t.legend_title || 'Легенда'}</h3>
              <div className="legend-items">
                {[['#3b82f6',t.leg_mountain||'Горы'],['#06b6d4',t.leg_lake||'Озёра'],['#f59e0b',t.leg_culture||'Культура'],['#22c55e',t.leg_nature||'Природа']].map(([c,l]) => (
                  <div key={l} className="legend-item"><div className="legend-dot" style={{background:c}}></div> {l}</div>
                ))}
              </div>
            </div>
          </div>

          <h2 style={{margin:'1.75rem 0 1.25rem',fontSize:'1.3rem'}}>{t.all_points || 'Все точки'}</h2>
          <div className="map-points">
            {MAP_POINTS.filter(p => filterType === 'all' || p.type === filterType).map(p => (
              <div key={p.name} className="map-point-card" onClick={() => flyTo(p.lat, p.lng, p.name)}>
                <i className={p.type==='mountain'?'fas fa-mountain':p.type==='lake'?'fas fa-water':p.type==='culture'?'fas fa-landmark':'fas fa-tree'}
                   style={{color:TYPE_COLORS[p.type]}}></i>
                <h4>{p.name}</h4>
                <p>{p.desc}</p>
                <small>{p.lat.toFixed(2)}°N, {p.lng.toFixed(2)}°E</small>
              </div>
            ))}
          </div>

          {/* GOOGLE MAPS EMBED */}
          <div style={{marginTop:'2.5rem'}}>
            <h2 style={{marginBottom:'1.1rem',fontSize:'1.2rem'}}>Google Maps</h2>
            <div style={{borderRadius:'var(--radius)',overflow:'hidden',boxShadow:'var(--shadow)'}}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2938285.7!2d74.5!3d41.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389c7aebe99d11c3%3A0x9e7f5fe35f0b0b1f!2sKyrgyzstan!5e0!3m2!1sru!2skg!4v1700000000000!5m2!1sru!2skg"
                width="100%" height="420" style={{border:0,display:'block'}} allowFullScreen loading="lazy" title="Карта Кыргызстана"></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
