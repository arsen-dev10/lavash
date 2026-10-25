import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'
import { showToast } from '../components/Toast'

export default function ReviewsPage() {
  const { lang, reviews, addReview, deleteReview } = useApp()
  const t = T[lang]
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [place, setPlace] = useState('')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [tips, setTips] = useState('')
  const [date, setDate] = useState('')
  const [filterPlace, setFilterPlace] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [sort, setSort] = useState('new')

  const total = reviews.length
  const avg = total ? (reviews.reduce((s,r)=>s+r.rating,0)/total).toFixed(1) : '—'
  const fiveStar = reviews.filter(r=>r.rating===5).length
  const placeCount = {}
  reviews.forEach(r => { placeCount[r.place]=(placeCount[r.place]||0)+1 })
  const topPlace = Object.keys(placeCount).reduce((a,b) => placeCount[a]>placeCount[b]?a:b, '—')

  const submit = () => {
    if (!name.trim()) { showToast(t.toast_err_name||'Введите имя','error'); return }
    if (!place) { showToast(t.toast_err_place||'Выберите место','error'); return }
    if (!rating) { showToast(t.toast_err_star||'Выберите оценку','error'); return }
    if (!text.trim() || text.length < 15) { showToast(t.toast_err_text||'Напишите отзыв','error'); return }
    addReview({ name: name.trim(), country: country.trim(), place, rating, text: text.trim(), tips: tips.trim(), date: date || new Date().toISOString().slice(0,7) })
    setName(''); setCountry(''); setPlace(''); setRating(0); setText(''); setTips(''); setDate('')
    showToast(t.toast_review||'Отзыв опубликован! 🙏','success')
  }

  let filtered = [...reviews]
  if (filterPlace) filtered = filtered.filter(r => r.place === filterPlace)
  if (filterRating) filtered = filtered.filter(r => r.rating >= parseInt(filterRating))
  if (sort === 'rating') filtered.sort((a,b) => b.rating - a.rating)
  else filtered.sort((a,b) => (b.id > a.id ? 1 : -1))

  const months = {ru:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],ky:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']}
  const fmtDate = d => { try { const[y,m]=d.split('-'); return `${(months[lang]||months.ru)[parseInt(m)-1]} ${y}` } catch { return d } }

  const PLACES = ['Иссык-Куль','Ала-Арча','Сон-Куль','Каньон Сказка','Пик Ленина','Хан-Тенгри','Ош','Арстанбап','Сары-Чeлек','Каракол','Таласская долина','Другое']

  return (
    <>
      <section className="page-hero" style={{background:'linear-gradient(135deg,#1e3a5f,#2563eb)'}}>
        <div className="page-hero-content">
          <h1><i className="fas fa-star"></i> {t.reviews_title}</h1>
          <p>{t.reviews_sub}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">{t.nav_home}</a> <i className="fas fa-chevron-right"></i> <span>{t.nav_reviews}</span>
          </div>

          {/* STATS */}
          <div className="reviews-stats">
            {[[total,t.total_reviews||'Отзывов','var(--primary)'],
              [avg==='—'?'—':`${avg} ★`,t.avg_rating||'Средний рейтинг','#f59e0b'],
              [topPlace,t.popular_place||'Популярное место','var(--green)'],
              [fiveStar,t.five_star||'Отзывов 5★','var(--primary)']
            ].map(([v,l,c]) => (
              <div key={l} className="rev-stat"><strong style={{color:c}}>{v}</strong><span>{l}</span></div>
            ))}
          </div>

          {/* FORM */}
          <div className="review-form-box">
            <h2><i className="fas fa-pen" style={{color:'var(--primary)'}}></i> {t.form_title}</h2>
            <div className="form-2col">
              <div className="form-group"><label>{t.form_name}</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Иван Иванов" /></div>
              <div className="form-group"><label>{t.form_country}</label><input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Россия..." /></div>
            </div>
            <div className="form-group">
              <label>{t.form_place}</label>
              <select value={place} onChange={e=>setPlace(e.target.value)}>
                <option value="">— {lang==='ky'?'Жерди тандаңыз':lang==='en'?'Select a place':'Выберите место'} —</option>
                {PLACES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-2col">
              <div className="form-group">
                <label>{t.form_rating}</label>
                <div className="star-rating">
                  {[5,4,3,2,1].map(n => (
                    <label key={n} style={{color: n <= rating ? 'var(--accent)' : '#d1d5db', cursor:'pointer', fontSize:'1.75rem'}}
                      onClick={() => setRating(n)}>★</label>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>{t.form_date}</label><input type="month" value={date} onChange={e=>setDate(e.target.value)} /></div>
            </div>
            <div className="form-group"><label>{t.form_text}</label><textarea value={text} onChange={e=>setText(e.target.value)} placeholder={lang==='en'?'Tell us about nature, people, transport...':lang==='ky'?'Табият, адамдар, транспорт жөнүндө айтыңыз...':'Расскажите о впечатлениях...'} /></div>
            <div className="form-group"><label>{t.form_tips}</label><input value={tips} onChange={e=>setTips(e.target.value)} placeholder={lang==='en'?'Best time to visit, what to bring...':lang==='ky'?'Баруунун эң жакшы мезгили...':'Лучшее время, что взять с собой...'} /></div>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'1rem',fontSize:'1rem'}} onClick={submit}>
              <i className="fas fa-paper-plane"></i> {t.form_submit}
            </button>
            <p style={{textAlign:'center',fontSize:'.78rem',color:'var(--gray)',marginTop:'.65rem'}}>
              <i className="fas fa-lock"></i> {lang==='ky'?'Пикирлер браузерде сакталат':lang==='en'?'Reviews are saved in your browser':'Отзывы сохраняются в браузере'}
            </p>
          </div>

          {/* ALL REVIEWS */}
          <div style={{marginTop:'2.5rem'}}>
            <div className="reviews-controls">
              <h2>{t.all_reviews}</h2>
              <div className="reviews-filters">
                <select className="filter-select" value={filterPlace} onChange={e=>setFilterPlace(e.target.value)}>
                  <option value="">{t.filter_allp||'Все места'}</option>
                  {PLACES.map(p=><option key={p}>{p}</option>)}
                </select>
                <select className="filter-select" value={filterRating} onChange={e=>setFilterRating(e.target.value)}>
                  <option value="">{t.filter_allr||'Все оценки'}</option>
                  <option value="5">★★★★★</option><option value="4">★★★★</option><option value="3">★★★</option>
                </select>
                <select className="filter-select" value={sort} onChange={e=>setSort(e.target.value)}>
                  <option value="new">{t.sort_new||'Сначала новые'}</option>
                  <option value="rating">{t.sort_rating||'По рейтингу'}</option>
                </select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="reviews-wall">
                {filtered.map(r => (
                  <div key={r.id} className="review-wall-card">
                    <div className="r-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                    <div className="r-text">"{r.text}"</div>
                    {r.tips && <div style={{fontSize:'.78rem',color:'var(--green)',marginBottom:'.7rem'}}><i className="fas fa-lightbulb"></i> <em>{r.tips}</em></div>}
                    <div className="r-footer">
                      <div>
                        <div className="r-author">{r.name} {r.country && <span style={{fontSize:'.75rem',color:'var(--gray)'}}>· {r.country}</span>}</div>
                        <div className="r-place"><i className="fas fa-map-marker-alt" style={{color:'var(--primary)'}}></i> {r.place}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="r-date">{fmtDate(r.date)}</div>
                        {!r.isDefault && (
                          <button onClick={() => { deleteReview(r.id); showToast(lang==='en'?'Review deleted':'Отзыв удалён','error') }}
                            style={{background:'none',border:'none',color:'var(--gray)',fontSize:'.75rem',cursor:'pointer',marginTop:'.25rem'}}>
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'3rem',color:'var(--gray)'}}>
                <i className="fas fa-comment-slash" style={{fontSize:'3rem',opacity:.22,display:'block',marginBottom:'1rem'}}></i>
                <p>{t.no_reviews}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
