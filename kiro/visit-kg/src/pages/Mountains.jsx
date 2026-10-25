import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'
import { showToast } from '../components/Toast'

export default function Mountains() {
  const { lang, mountains, saved, toggleSave } = useApp()
  const t = T[lang]

  return (
    <>
      <section className="page-hero" style={{backgroundImage:"url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400')"}}>
        <div className="page-hero-bg"></div>
        <div className="page-hero-content">
          <h1><i className="fas fa-mountain"></i> {t.mountains_title}</h1>
          <p>{t.mountains_sub}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">{t.nav_home}</a>
            <i className="fas fa-chevron-right"></i>
            <span>{t.nav_mountains}</span>
          </div>

          {/* STATS ROW */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.2rem',marginBottom:'2.5rem'}}>
            {[['94',lang==='ky'?'Чокусу 4000 м+':lang==='en'?'Peaks above 4000m':'Пиков выше 4000 м'],
              ['7439',lang==='ky'?'Эң бийик чоку (м)':lang==='en'?'Highest peak (m)':'Высшая точка (м)'],
              ['40%',lang==='ky'?'Аймак — тоолор':lang==='en'?'Territory — mountains':'Территории — горы'],
              ['6',lang==='ky'?'Жети миңдик':lang==='en'?'Seven-thousanders':'Семитысячников']
            ].map(([v,l]) => (
              <div key={l} style={{textAlign:'center',background:'var(--light)',borderRadius:'var(--radius)',padding:'1.4rem'}}>
                <div style={{fontSize:'1.9rem',fontWeight:800,color:'var(--primary)'}}>{v}</div>
                <div style={{color:'var(--gray)',fontSize:'.85rem'}}>{l}</div>
              </div>
            ))}
          </div>

          <div className="mountain-grid">
            {mountains.map(m => {
              const name = m[`name${lang==='ru'?'':lang.charAt(0).toUpperCase()+lang.slice(1)}`] || m.name
              const desc = m[`desc${lang==='ru'?'':lang.charAt(0).toUpperCase()+lang.slice(1)}`] || m.desc
              const isSaved = saved.includes(m.name)
              return (
                <div key={m.id} className="mountain-card">
                  <div className="mountain-img" style={{backgroundImage:`url('${m.img}')`}}>
                    <span className="mountain-badge">🏔️ {m.height} м • {m.range}</span>
                  </div>
                  <div className="mountain-body">
                    <h2>{name}</h2>
                    <p>{desc}</p>
                    <div className="mountain-info">
                      <div className="info-badge"><i className="fas fa-ruler-vertical"></i> {m.height} м</div>
                      <div className="info-badge"><i className="fas fa-calendar"></i> {m.season}</div>
                      <div className="info-badge"><i className="fas fa-star"></i> {m.difficulty}</div>
                    </div>
                    <div className="mountain-transport">
                      <h4><i className="fas fa-route" style={{color:'var(--primary)',marginRight:'.4rem'}}></i> {t.how_to_get}</h4>
                      <ul>
                        {m.transport.split('·').map((tr,i) => (
                          <li key={i}><i className="fas fa-arrow-right"></i> {tr.trim()}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{display:'flex',gap:'.65rem',flexWrap:'wrap'}}>
                      <Link to="/routes" className="btn-sm btn-primary-sm"><i className="fas fa-hiking"></i> {lang==='ky'?'Маршрут':lang==='en'?'Route':'Маршрут'}</Link>
                      <Link to="/map" className="btn-sm btn-green-sm"><i className="fas fa-map"></i> {t.btn_map}</Link>
                      <button className="btn-sm" style={{background:'var(--light)',border:'none',color:isSaved?'var(--primary)':'var(--gray)'}}
                        onClick={() => { toggleSave(m.name); showToast(isSaved?`«${name}» удалено`:`«${name}» сохранено!`, isSaved?'error':'success') }}>
                        <i className={`fa${isSaved?'s':'r'} fa-bookmark`}></i> {t.btn_save}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* TIPS */}
          <div className="tips-box">
            <h2 style={{fontSize:'1.5rem',marginBottom:'.5rem'}}>
              <i className="fas fa-exclamation-circle" style={{color:'var(--accent)'}}></i> {t.mountains_title} — {lang==='ky'?'Маанилүү кеңештер':lang==='en'?'Important Tips':'Важные советы'}
            </h2>
            <div className="tips-grid">
              {[['fas fa-id-card','tip1_t','tip1_d'],['fas fa-medkit','tip2_t','tip2_d'],['fas fa-users','tip3_t','tip3_d']].map(([icon,tKey,dKey]) => (
                <div className="tip-item" key={tKey}>
                  <h4><i className={icon}></i> {t[tKey] || (tKey==='tip1_t'?'Разрешения':tKey==='tip2_t'?'Страховка':'Гиды')}</h4>
                  <p>{t[dKey] || (dKey==='tip1_d'?'Пропуск ГКНБ для погранзон':dKey==='tip2_d'?'Страховка от $50 000':'Сертифицированные гиды КР')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
