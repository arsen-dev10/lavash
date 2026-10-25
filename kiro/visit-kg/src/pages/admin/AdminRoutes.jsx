import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { adminToast } from '../../components/admin/AdminToast'
import ConfirmModal from '../../components/admin/ConfirmModal'

const TYPE_LABELS = {trek:'Треккинг',horse:'Конный',climb:'Альпинизм',culture:'Культурный'}
const DIFF_LABELS = {easy:'Лёгкий',medium:'Средний',hard:'Сложный'}
const emptyRoute = () => ({id:'',name:'',type:'trek',difficulty:'easy',duration:'',distance:'',height:'',season:'',transport:'',status:'active'})

export default function AdminRoutes() {
  const { routes, addRoute, updateRoute, deleteRoute } = useApp()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [diffFilter, setDiffFilter] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyRoute())
  const [confirm, setConfirm] = useState(null)

  const filtered = routes.filter(r =>
    (!search || r.name.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || r.type === typeFilter) &&
    (!diffFilter || r.difficulty === diffFilter)
  )

  const openAdd = () => { setForm(emptyRoute()); setModal(true) }
  const openEdit = r => { setForm({...r}); setModal(true) }
  const f = (k,v) => setForm(s=>({...s,[k]:v}))

  const handleSave = () => {
    if (!form.name.trim()) { adminToast('Введите название','err'); return }
    if (form.id) { updateRoute(form); adminToast(`«${form.name}» обновлён`,'ok') }
    else { addRoute(form); adminToast(`«${form.name}» добавлен`,'ok') }
    setModal(false)
  }
  const handleDelete = id => {
    const r = routes.find(x=>x.id===id)
    setConfirm({id, name: r?.name||id})
  }
  const confirmDelete = () => {
    deleteRoute(confirm.id)
    adminToast(`«${confirm.name}» удалён`,'warn')
    setConfirm(null)
  }

  const diffClass = {easy:'easy',medium:'medium',hard:'hard'}

  return (
    <div className="admin-body">
      <div className="admin-page-header">
        <div><h1>Маршруты</h1><p>Управление туристическими маршрутами</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openAdd}><i className="fas fa-plus"></i> Добавить маршрут</button>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-wrap"><i className="fas fa-search"></i><input placeholder="Поиск маршрута..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <select className="admin-select" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          <option value="">Все типы</option>
          {Object.entries(TYPE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
        <select className="admin-select" value={diffFilter} onChange={e=>setDiffFilter(e.target.value)}>
          <option value="">Любая сложность</option>
          {Object.entries(DIFF_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
        <span style={{fontSize:'.8rem',color:'var(--gray)'}}>Найдено: {filtered.length}</span>
      </div>

      <div className="admin-card">
        <div style={{padding:0}}>
          <table className="admin-table">
            <thead><tr>
              <th>#</th><th>Название</th><th>Тип</th><th>Сложность</th>
              <th>Длит.</th><th>Дист.</th><th>Сезон</th><th>Статус</th><th>Действия</th>
            </tr></thead>
            <tbody>
              {filtered.map((r,i) => (
                <tr key={r.id}>
                  <td style={{color:'var(--gray)',fontSize:'.78rem'}}>{i+1}</td>
                  <td><div className="name-cell">{r.name}</div><div className="sub-text">{r.transport||''}</div></td>
                  <td><span className={`a-badge a-badge-${r.type}`}>{TYPE_LABELS[r.type]||r.type}</span></td>
                  <td><span className={`a-badge a-badge-${diffClass[r.difficulty]}`}>{DIFF_LABELS[r.difficulty]||r.difficulty}</span></td>
                  <td style={{fontSize:'.82rem'}}>{r.duration||'—'}</td>
                  <td style={{fontSize:'.82rem'}}>{r.distance||'—'}</td>
                  <td style={{fontSize:'.78rem',color:'var(--gray)'}}>{r.season||'—'}</td>
                  <td><span className={`a-badge a-badge-${r.status==='active'?'active':'hidden'}`}>{r.status==='active'?'Активен':'Скрыт'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'.35rem'}}>
                      <button className="btn-admin btn-admin-ghost btn-icon-sm" onClick={()=>openEdit(r)}><i className="fas fa-edit"></i></button>
                      <button className="btn-admin btn-admin-ghost btn-icon-sm" onClick={()=>handleDelete(r.id)} style={{color:'var(--red)'}}><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="empty-state"><i className="fas fa-route"></i><p>Маршруты не найдены</p></div>}
        </div>
      </div>

      {/* MODAL */}
      <div className={`modal-overlay${modal?' open':''}`}>
        <div className="modal" style={{maxWidth:640}}>
          <div className="modal-header">
            <h3><i className="fas fa-route" style={{color:'var(--primary)'}}></i> {form.id?'Редактировать маршрут':'Добавить маршрут'}</h3>
            <button className="modal-close" onClick={()=>setModal(false)}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body">
            <div className="admin-2col">
              <div className="admin-form-group form-full"><label>Название <span className="req">*</span></label><input className="admin-form-control" value={form.name} onChange={e=>f('name',e.target.value)} placeholder="Ала-Арча — Водопад Ак-Сай" /></div>
              <div className="admin-form-group"><label>Тип</label>
                <select className="admin-form-control" value={form.type} onChange={e=>f('type',e.target.value)}>
                  {Object.entries(TYPE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select></div>
              <div className="admin-form-group"><label>Сложность</label>
                <select className="admin-form-control" value={form.difficulty} onChange={e=>f('difficulty',e.target.value)}>
                  {Object.entries(DIFF_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select></div>
              <div className="admin-form-group"><label>Длительность</label><input className="admin-form-control" value={form.duration} onChange={e=>f('duration',e.target.value)} placeholder="6-7 ч" /></div>
              <div className="admin-form-group"><label>Дистанция</label><input className="admin-form-control" value={form.distance} onChange={e=>f('distance',e.target.value)} placeholder="14 км" /></div>
              <div className="admin-form-group"><label>Высота</label><input className="admin-form-control" value={form.height} onChange={e=>f('height',e.target.value)} placeholder="2200-3500 м" /></div>
              <div className="admin-form-group"><label>Сезон</label><input className="admin-form-control" value={form.season} onChange={e=>f('season',e.target.value)} placeholder="Май–Октябрь" /></div>
              <div className="admin-form-group"><label>Статус</label>
                <select className="admin-form-control" value={form.status} onChange={e=>f('status',e.target.value)}>
                  <option value="active">✅ Активен</option><option value="hidden">🔒 Скрыт</option>
                </select></div>
              <div className="admin-form-group form-full"><label>Транспорт / как добраться</label><input className="admin-form-control" value={form.transport} onChange={e=>f('transport',e.target.value)} placeholder="Маршрутка из Бишкека (1 ч, 60 сом)" /></div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-admin btn-admin-ghost" onClick={()=>setModal(false)}>Отмена</button>
            <button className="btn-admin btn-admin-primary" onClick={handleSave}><i className="fas fa-save"></i> Сохранить</button>
          </div>
        </div>
      </div>

      <ConfirmModal open={!!confirm} title="Удалить маршрут?" message={`Удалить «${confirm?.name}»?`} onConfirm={confirmDelete} onCancel={()=>setConfirm(null)} />
    </div>
  )
}
