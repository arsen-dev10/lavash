import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'
import { showToast } from './Toast'

const CAT_LABELS = {ru:{lake:'Озеро',gorge:'Ущелье',canyon:'Каньон',forest:'Лес',city:'Город',culture:'Культура',mountain:'Гора'},en:{lake:'Lake',gorge:'Gorge',canyon:'Canyon',forest:'Forest',city:'City',culture:'Culture',mountain:'Mountain'},ky:{lake:'Көл',gorge:'Капчыгай',canyon:'Каньон',forest:'Токой',city:'Шаар',culture:'Маданият',mountain:'Тоо'}}

export default function PlaceCard({ place }) {
  const { lang, saved, toggleSave } = useApp()
  const t = T[lang]
  const isSaved = saved.includes(place.name)
  const name = place[`name${lang==='ru'?'':lang.charAt(0).toUpperCase()+lang.slice(1)}`] || place.name
  const desc = place[`desc${lang==='ru'?'':lang.charAt(0).toUpperCase()+lang.slice(1)}`] || place.desc

  const handleSave = () => {
    toggleSave(place.name)
    showToast(isSaved ? `«${name}» удалено` : `«${name}» сохранено!`, isSaved ? 'error' : 'success')
  }

  return (
    <div className="place-card">
      <div className="place-img" style={{ backgroundImage: `url('${place.img}')` }}>
        <span className="place-badge">{(CAT_LABELS[lang]||CAT_LABELS.ru)[place.cat] || place.cat}</span>
        <button className={`save-btn${isSaved?' saved':''}`} onClick={handleSave} title={t.btn_save}>
          <i className={`fa${isSaved?'s':'r'} fa-bookmark`}></i>
        </button>
      </div>
      <div className="place-body">
        <h3>{name}</h3>
        <p>{desc}</p>
        <div className="place-meta">
          <span><i className="fas fa-map-marker-alt"></i> {place.region}</span>
          <span className="stars">{'★'.repeat(place.rating)}{'☆'.repeat(5-place.rating)}</span>
        </div>
        <div className="place-transport">
          <strong>{t.how_to_get}:</strong><br />
          {place.transport.split('·').map((tr, i) => (
            <span key={i}><i className="fas fa-circle" style={{fontSize:'.4rem',verticalAlign:'middle',marginRight:'.3rem'}}></i>{tr.trim()}<br /></span>
          ))}
        </div>
        {place.bestTime && <div style={{fontSize:'.78rem',color:'var(--gray)',marginBottom:'.85rem'}}><strong>{t.best_time}:</strong> {place.bestTime}</div>}
        <div className="place-actions">
          <Link to="/map" className="btn-sm btn-primary-sm"><i className="fas fa-map"></i> {t.btn_map}</Link>
          <Link to="/reviews" className="btn-sm btn-green-sm"><i className="fas fa-star"></i> {t.btn_reviews}</Link>
        </div>
      </div>
    </div>
  )
}
