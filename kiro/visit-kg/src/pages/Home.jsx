import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'
import PlaceCard from '../components/PlaceCard'
import { showToast } from '../components/Toast'

const ROUTE_DATA = {
  'Бишкек_Иссык-Куль_Автобус': { time:'4-5 ч', price:'300-500 сом', desc:'Маршрутка с Западного автовокзала. Отправление с 06:00.' },
  'Бишкек_Иссык-Куль_Такси/Авто': { time:'3-4 ч', price:'2000-3000 сом', desc:'Такси или аренда авто по трассе А-363.' },
  'Бишкек_Ала-Арча_Автобус': { time:'1 ч', price:'60 сом', desc:'Маршрутка №265 из Бишкека (ост. Орто-Сай).' },
  'Бишкек_Ала-Арча_Такси/Авто': { time:'40 мин', price:'600-800 сом', desc:'Такси до КПП парка.' },
  'Бишкек_Сон-Куль_Автобус': { time:'5-6 ч', price:'350-500 сом', desc:'До Кочкора маршруткой (3 ч) + местный транспорт.' },
  'Бишкек_Каньон Сказка_Автобус': { time:'8 ч', price:'600 сом', desc:'До Каракола (6-7 ч) + такси до каньона.' },
  'Бишкек_Каньон Сказка_Такси/Авто': { time:'5 ч', price:'4000-5000 сом', desc:'Аренда авто через Иссык-Куль.' },
}

export default function Home() {
  const { lang, places, reviews, saved, setSaved } = useApp()
  const t = T[lang]
  const navigate = useNavigate()
  const [from, setFrom] = useState('Бишкек')
  const [to, setTo] = useState('Иссык-Куль')
  const [transport, setTransport] = useState('Автобус')
  const [planResult, setPlanResult] = useState(null)

  const topPlaces = places.filter(p => p.status === 'active').slice(0, 6)
  const previewReviews = reviews.slice(0, 3)

  const quickPlan = () => {
    const key = `${from}_${to}_${transport}`
    const data = ROUTE_DATA[key]
    if (data) setPlanResult(data)
    else setPlanResult({ time:'—', price:'—', desc: lang==='en'?'We recommend renting a car or joining an organized tour.':lang==='ky'?'Машина ижарасын сунуштайбыз.':'Рекомендуем аренду авто или организованный тур.' })
  }

  const clearSaved = () => { setSaved([]); showToast(t.clear_saved || 'Список очищен', '') }

  const cats = [
    { icon:'fas fa-mountain', key:'cat_mountains', href:'/mountains', bg:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
    { icon:'fas fa-water',    key:'cat_lakes',     href:'/places', bg:'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600' },
    { icon:'fas fa-hiking',   key:'cat_trekking',  href:'/routes', bg:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600' },
    { icon:'fas fa-landmark', key:'cat_culture',   href:'/places', bg:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600' },
    { icon:'fas fa-horse',    key:'cat_horse',     href:'/routes', bg:'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600' },
    { icon:'fas fa-tree',     key:'cat_gorge',     href:'/places', bg:'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=600' },
  ]
  const whyItems = [
    {icon:'fas fa-mountain',t:'why1_t',d:'why1_d'},{icon:'fas fa-dollar-sign',t:'why2_t',d:'why2_d'},
    {icon:'fas fa-users',t:'why3_t',d:'why3_d'},{icon:'fas fa-leaf',t:'why4_t',d:'why4_d'},
    {icon:'fas fa-route',t:'why5_t',d:'why5_d'},{icon:'fas fa-shield-alt',t:'why6_t',d:'why6_d'},
  ]

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{t.hero_title} <span className="accent">{t.hero_country}</span></h1>
          <p>{t.hero_sub}</p>
          <div className="hero-btns">
            <Link to="/places" className="btn btn-primary"><i className="fas fa-compass"></i> {t.hero_btn1}</Link>
            <Link to="/routes" className="btn btn-outline"><i className="fas fa-route"></i> {t.hero_btn2}</Link>
          </div>
          <div className="hero-stats">
            {[['94',t.stat_peaks],['1923 м',t.stat_height],['40+',t.stat_routes],['500K+',t.stat_tourists]].map(([v,l]) => (
              <div className="hero-stat" key={l}><strong>{v}</strong><span>{l}</span></div>
            ))}
          </div>
        </div>
        <div className="hero-scroll"><i className="fas fa-chevron-down"></i></div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t.sec_categories}</h2>
          <div className="categories-grid">
            {cats.map(c => (
              <Link to={c.href} key={c.key} className="cat-card">
                <div className="cat-bg" style={{ backgroundImage: `url('${c.bg}')` }}></div>
                <div className="cat-overlay"></div>
                <div className="cat-content">
                  <i className={c.icon}></i>
                  <h3>{t[c.key]}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOP PLACES */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">{t.sec_top}</h2>
          <p className="section-sub">{t.sec_top_sub}</p>
          <div className="places-grid">
            {topPlaces.map(p => <PlaceCard key={p.id} place={p} />)}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section why-section">
        <div className="container">
          <h2 className="section-title white">{t.sec_why}</h2>
          <div className="why-grid">
            {whyItems.map(w => (
              <div className="why-item" key={w.t}>
                <i className={w.icon}></i>
                <h3>{t[w.t]}</h3>
                <p>{t[w.d]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      {previewReviews.length > 0 && (
        <section className="section bg-light">
          <div className="container">
            <h2 className="section-title">{t.sec_reviews}</h2>
            <div className="reviews-wall">
              {previewReviews.map(r => (
                <div key={r.id} className="review-wall-card">
                  <div className="r-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                  <div className="r-text">"{r.text.slice(0,130)}{r.text.length>130?'...':''}"</div>
                  <div className="r-footer">
                    <div><div className="r-author">{r.name}</div><div className="r-place"><i className="fas fa-map-marker-alt" style={{color:'var(--primary)'}}></i> {r.place}</div></div>
                    <div className="r-date">{r.date}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center',marginTop:'1.75rem'}}>
              <Link to="/reviews" className="btn btn-primary">{t.sec_all_reviews}</Link>
            </div>
          </div>
        </section>
      )}

      {/* PLANNER */}
      <section className="section bg-light">
        <div className="container">
          <div className="planner-box">
            <div className="planner-text">
              <h2>{t.sec_plan}</h2>
              <p>{lang==='en'?'Tell us where you\'re going and we\'ll find the best route.':lang==='ky'?'Кайда баратканыңызды айтыңыз — маршрут табабыз.':'Укажите откуда и куда — подберём маршрут и транспорт.'}</p>
              <Link to="/routes" className="btn btn-primary"><i className="fas fa-map-marked-alt"></i> {lang==='en'?'All routes':lang==='ky'?'Бардык маршруттар':'Все маршруты'}</Link>
            </div>
            <div>
              {[{label:t.plan_from,val:from,set:setFrom,opts:['Бишкек','Ош','Каракол','Нарын']},
                {label:t.plan_to,val:to,set:setTo,opts:['Иссык-Куль','Ала-Арча','Сон-Куль','Каньон Сказка','Пик Ленина (БЛ)']},
                {label:t.plan_transport,val:transport,set:setTransport,opts:['Автобус','Такси/Авто','Самолёт + авто','Конный тур']}
              ].map(f => (
                <div className="form-group" key={f.label}>
                  <label>{f.label}</label>
                  <select className="filter-select" style={{width:'100%'}} value={f.val} onChange={e=>f.set(e.target.value)}>
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button className="btn btn-primary" style={{width:'100%'}} onClick={quickPlan}>
                <i className="fas fa-search-location"></i> {t.plan_btn}
              </button>
              {planResult && (
                <div className="plan-result show" style={{marginTop:'1rem'}}>
                  <strong style={{color:'var(--primary)'}}><i className="fas fa-route"></i> {from} → {to}</strong>
                  <div style={{display:'flex',gap:'1.5rem',margin:'.45rem 0',flexWrap:'wrap'}}>
                    <span><i className="fas fa-clock" style={{color:'var(--primary)'}}></i> {planResult.time}</span>
                    <span><i className="fas fa-wallet" style={{color:'var(--green)'}}></i> {planResult.price}</span>
                  </div>
                  <p style={{fontSize:'.86rem',color:'var(--gray)'}}>{planResult.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SAVED */}
      {saved.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">{t.saved_places}</h2>
            <div className="saved-list">
              {saved.map(name => (
                <div key={name} className="saved-tag">
                  <i className="fas fa-map-marker-alt"></i> {name}
                  <button onClick={() => { setSaved(saved.filter(s=>s!==name)); showToast(`«${name}» удалено`,'error') }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-outline-dark" style={{marginTop:'1rem'}} onClick={clearSaved}>
              <i className="fas fa-trash"></i> {t.clear_saved}
            </button>
          </div>
        </section>
      )}
    </>
  )
}
