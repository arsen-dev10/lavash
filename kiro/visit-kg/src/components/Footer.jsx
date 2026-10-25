import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'

export default function Footer() {
  const { lang } = useApp()
  const t = T[lang]
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="logo"><i className="fas fa-mountain"></i> <strong>VisitKyrgyzstan</strong></div>
            <p>{t.footer_tagline}</p>
            <div className="social-links">
              {[['instagram','fab fa-instagram'],['facebook','fab fa-facebook'],['youtube','fab fa-youtube'],['telegram','fab fa-telegram']].map(([n,ic]) => (
                <a key={n} href="#" aria-label={n}><i className={ic}></i></a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>{t.footer_nav}</h4>
            <ul>
              {[['/','nav_home'],['/places','nav_places'],['/mountains','nav_mountains'],['/routes','nav_routes'],['/map','nav_map'],['/reviews','nav_reviews']].map(([to,key]) => (
                <li key={to}><NavLink to={to}>{t[key]}</NavLink></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>{lang==='ky'?'Аймактар':lang==='en'?'Regions':'Регионы'}</h4>
            <ul>
              {['Бишкек','Иссык-Куль','Ош и Юг','Нарын','Жалал-Абад'].map(r => (
                <li key={r}><a href="#">{r}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer_contact}</h4>
            <p><i className="fas fa-envelope"></i> info@visit-kyrgyzstan.kg</p>
            <p><i className="fas fa-phone"></i> +996 312 000 000</p>
            <p><i className="fas fa-map-marker-alt"></i> г. Бишкек, пр. Чуй 101</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 VisitKyrgyzstan. {t.footer_copy}</p>
          <p>{lang==='ky'?'Жасалган':'Создано с'} <i className="fas fa-heart" style={{color:'#e74c3c'}}></i> {lang==='ky'?'туристтер үчүн':lang==='en'?'for tourists':'для туристов'}</p>
        </div>
      </div>
    </footer>
  )
}
