import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { T } from '../data/translations'

const SEARCH_DATA = [
  { name:{ru:'Иссык-Куль',en:'Issyk-Kul',ky:'Ысык-Көл'}, desc:{ru:'Горное озеро',en:'Mountain lake',ky:'Тоо көлү'}, url:'/places', icon:'fas fa-water', cat:'lake' },
  { name:{ru:'Ала-Арча',en:'Ala-Archa',ky:'Ала-Арча'}, desc:{ru:'Нац. парк',en:'National park',ky:'Улуттук парк'}, url:'/places', icon:'fas fa-tree', cat:'gorge' },
  { name:{ru:'Сон-Куль',en:'Son-Kul',ky:'Соң-Көл'}, desc:{ru:'Высокогорное озеро',en:'Alpine lake',ky:'Бийик тоо көлү'}, url:'/places', icon:'fas fa-water', cat:'lake' },
  { name:{ru:'Каньон Сказка',en:'Fairy Tale Canyon',ky:'Жомок Каньону'}, desc:{ru:'Красные скалы',en:'Red rocks canyon',ky:'Кызыл аскалар'}, url:'/places', icon:'fas fa-mountain', cat:'canyon' },
  { name:{ru:'Пик Ленина',en:'Lenin Peak',ky:'Ленин Чокусу'}, desc:{ru:'7134 м',en:'7134 m',ky:'7134 м'}, url:'/mountains', icon:'fas fa-mountain', cat:'mountain' },
  { name:{ru:'Хан-Тенгри',en:'Khan Tengri',ky:'Хан-Теңири'}, desc:{ru:'6995 м',en:'6995 m',ky:'6995 м'}, url:'/mountains', icon:'fas fa-mountain', cat:'mountain' },
  { name:{ru:'Ош',en:'Osh',ky:'Ош'}, desc:{ru:'Древний город',en:'Ancient city',ky:'Байыркы шаар'}, url:'/places', icon:'fas fa-landmark', cat:'city' },
  { name:{ru:'Арстанбап',en:'Arstanbap',ky:'Арстанбап'}, desc:{ru:'Ореховый лес',en:'Walnut forest',ky:'Жаңгак токою'}, url:'/places', icon:'fas fa-tree', cat:'forest' },
  { name:{ru:'Треккинг',en:'Trekking',ky:'Треккинг'}, desc:{ru:'Маршруты',en:'Routes',ky:'Маршруттар'}, url:'/routes', icon:'fas fa-hiking', cat:'trek' },
  { name:{ru:'Карта',en:'Map',ky:'Карта'}, desc:{ru:'Все места на карте',en:'All places on map',ky:'Картадагы жерлер'}, url:'/map', icon:'fas fa-map', cat:'map' },
  { name:{ru:'Отзывы',en:'Reviews',ky:'Пикирлер'}, desc:{ru:'Отзывы туристов',en:'Tourist reviews',ky:'Туристтердин пикири'}, url:'/reviews', icon:'fas fa-star', cat:'reviews' },
  { name:{ru:'Маршруты',en:'Routes',ky:'Маршруттар'}, desc:{ru:'Все маршруты',en:'All routes',ky:'Бардык маршруттар'}, url:'/routes', icon:'fas fa-route', cat:'routes' },
]

export default function Header() {
  const { lang, setLang } = useApp()
  const t = T[lang]
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [dropOpen, setDropOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = val => {
    setQuery(val)
    if (!val.trim()) { setDropOpen(false); setResults([]); return }
    const q = val.toLowerCase()
    const found = SEARCH_DATA.filter(d => {
      const n = (d.name[lang] || d.name.ru || '').toLowerCase()
      const desc = (d.desc[lang] || d.desc.ru || '').toLowerCase()
      return n.includes(q) || desc.includes(q)
    }).slice(0, 7)
    setResults(found)
    setDropOpen(true)
  }

  const doSearch = () => {
    const q = query.trim().toLowerCase()
    if (!q) return
    const found = SEARCH_DATA.find(d => (d.name[lang]||d.name.ru||'').toLowerCase().includes(q))
    if (found) { navigate(found.url); setDropOpen(false); setQuery('') }
    else alert(t.search_no || 'Ничего не найдено')
  }

  const catLabels = {ru:{lake:'Озеро',mountain:'Гора',canyon:'Каньон',forest:'Лес',city:'Город',gorge:'Ущелье',trek:'Маршрут',map:'Карта',reviews:'Отзывы',routes:'Маршруты'},en:{lake:'Lake',mountain:'Mountain',canyon:'Canyon',forest:'Forest',city:'City',gorge:'Gorge',trek:'Route',map:'Map',reviews:'Reviews',routes:'Routes'},ky:{lake:'Көл',mountain:'Тоо',canyon:'Каньон',forest:'Токой',city:'Шаар',gorge:'Капчыгай',trek:'Маршрут',map:'Карта',reviews:'Пикирлер',routes:'Маршруттар'}}

  return (
    <header className="header">
      <div className="container">
        <NavLink to="/" className="logo">
          <i className="fas fa-mountain"></i>
          <span>Visit<strong>Kyrgyzstan</strong></span>
        </NavLink>

        <nav className={`nav${navOpen ? ' open' : ''}`}>
          {[['/', t.nav_home, 'fa-home'], ['/places', t.nav_places, 'fa-map-marker-alt'],
            ['/mountains', t.nav_mountains, 'fa-mountain'], ['/routes', t.nav_routes, 'fa-route'],
            ['/map', t.nav_map, 'fa-map'], ['/reviews', t.nav_reviews, 'fa-star']
          ].map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to==='/'} onClick={() => setNavOpen(false)}>
              <i className={`fas ${icon}`}></i> {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-right">
          <div className="lang-switcher">
            {['ru','en','ky'].map(l => (
              <button key={l} className={`lang-btn${lang===l?' active':''}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="burger" onClick={() => setNavOpen(o => !o)}>
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="search-section">
        <div className="container">
          <div className="search-box" ref={searchRef}>
            <i className="fas fa-search"></i>
            <div className="search-wrap">
              <input
                value={query}
                onChange={e => handleSearch(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter') doSearch(); if (e.key==='Escape') setDropOpen(false) }}
                placeholder={t.search_ph}
              />
              {dropOpen && results.length > 0 && (
                <div className="search-dropdown">
                  <div className="search-header-row"><i className="fas fa-search"></i> Результаты поиска</div>
                  {results.map((r, i) => (
                    <NavLink key={i} to={r.url} className="search-item" onClick={() => { setDropOpen(false); setQuery('') }}>
                      <div className="search-item-icon"><i className={r.icon}></i></div>
                      <div className="search-item-text">
                        <strong>{r.name[lang] || r.name.ru}</strong>
                        <span>{r.desc[lang] || r.desc.ru}</span>
                      </div>
                      <div className="search-item-cat">{(catLabels[lang]||catLabels.ru)[r.cat]}</div>
                    </NavLink>
                  ))}
                </div>
              )}
              {dropOpen && results.length === 0 && (
                <div className="search-dropdown">
                  <div className="search-no-result"><i className="fas fa-search-minus"></i> {t.search_no}</div>
                </div>
              )}
            </div>
            <button onClick={doSearch}>{t.search_btn}</button>
          </div>
        </div>
      </div>
    </header>
  )
}
