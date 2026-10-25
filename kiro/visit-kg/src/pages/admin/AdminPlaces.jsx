import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { adminToast } from '../../components/admin/AdminToast'
import ConfirmModal from '../../components/admin/ConfirmModal'

const CAT_LABELS = {lake:'Озеро',gorge:'Ущелье',canyon:'Каньон',forest:'Лес',culture:'Культура',city:'Город',mountain:'Гора'}
const CATS = ['lake','gorge','canyon','culture','forest','city','mountain']
const empty = () => ({id:'',name:'',cat:'lake',region:'',rating:5,status:'active',transport:'',desc:'',img:'',bestTime:''})

export default function AdminPlaces() {
  const { places, addPlace, updatePlace, deletePlace } = useApp()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty())
  const [confirm, setConfirm] = useState(null)

  const filtered = places.filter(p => {
    const q = search.toLowerCase()
    return (!q || p.name.toLowerCase().includes(q) || (p.region||'').toLowerCase().includes(q))
      && (!catFilter || p.cat === catFilter)
      && (!statusFilter || p.status === statusFilter)
  })

  const openAdd = () => { setForm(empty()); setModal(true) }
  const openEdit = p => { setForm({...p}); setModal(true) }
  const handleSave = () => {
    if (!form.name.trim()) { adminToast('Введите название','err'); return }
    if (!form.region.trim()) { adminToast('Введите регион','err'); return }
    if (form.id) { updatePlace(form); adminToast(`«${form.name}» обновлён`,'ok') }
    else { addPlace(form); adminToast(`«${form.name}» добавлен`,'ok') }
    setModal(false)
  }
  const handleDelete = id => {
    const p = places.find(x=>x.id===id)
    setConfirm({ id, name: p?.name||id })
  }
  const confirmDelete = () => {
    deletePlace(confirm.id)
    adminToast(`«${confirm.name}» удалён`,'warn')
    setConfirm(null)
  }
  const toggleStatus = p => {
    updatePlace({...p, status: p.status==='active'?'hidden':'active'})
    adminToast('Статус изменён','ok')
  }

  const f = (k,v) => setForm(s => ({...s,[k]:v}))

  return (
    <div className="admin-body">
      <div className="admin-page-header">
        <div><h1>Места</h1><p>Управление достопримечательностями</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openAdd}><i className="fas fa-plus"></i> Добавить место</button>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-wrap"><i className="fas fa-search"></i><input placeholder="Поиск по названию..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <select className="admin-select" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          <option value="">Все категории</option>
          {CATS.map(c=><option key={c} value={c}>{CAT_LABELS[c]}</option>)}
        </select>
        <select className="admin-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="">Все статусы</option><option value="active">Активные</option><option value="hidden">Скрытые</option>
        </select>
        <span style={{fontSize:'.8rem',color:'var(--gray)'}}>Найдено: {filtered.length}</span>
      </div>

      <div className="admin-card">
        <div style={{padding:0}}>
          <table className="admin-table">
            <thead><tr>
              <th>#</th><th>Место</th><th>Категория</th><th>Регион</th>
              <th>Рейтинг</th><th>Статус</th><th>Действия</th>
            </tr></thead>
            <tbody>
              {filtered.map((p,i) => (
                <tr key={p.id}>
                  <td style={{color:'var(--gray)',fontSize:'.78rem'}}>{i+1}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'.7rem'}}>
                      {p.img ? <img src={p.img} alt={p.name} style={{width:40,height:40,borderRadius:8,objectFit:'cover',flexShrink:0}} onError={e=>e.target.style.display='none'} /> :
                        <div style={{width:40,height:40,borderRadius:8,background:'var(--light)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--gray)'}}><i className="fas fa-image"></i></div>}
                      <div><div className="name-cell">{p.name}</div><div className="sub-text">{(p.desc||'').slice(0,55)}{(p.desc||'').length>55?'...':''}</div></div>
                    </div>
                  </td>
                  <td><span className={`a-badge a-badge-${p.cat}`}>{CAT_LABELS[p.cat]||p.cat}</span></td>
                  <td style={{fontSize:'.82rem',color:'var(--gray)'}}>{p.region||'—'}</td>
                  <td><span className="a-stars">{'★'.repeat(p.rating||0)}</span></td>
                  <td><span className={`a-badge a-badge-${p.status==='active'?'active':'hidden'}`}>{p.status==='active'?'Активен':'Скрыт'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'.35rem'}}>
                      <button className="btn-admin btn-admin-ghost btn-icon-sm" onClick={()=>openEdit(p)} title="Редактировать"><i className="fas fa-edit"></i></button>
                      <button className="btn-admin btn-admin-ghost btn-icon-sm" onClick={()=>toggleStatus(p)} title={p.status==='active'?'Скрыть':'Показать'} style={{color:p.status==='active'?'#ea580c':'var(--green)'}}><i className={`fas fa-eye${p.status==='active'?'-slash':''}`}></i></button>
                      <button className="btn-admin btn-admin-ghost btn-icon-sm" onClick={()=>handleDelete(p.id)} title="Удалить" style={{color:'var(--red)'}}><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="empty-state"><i className="fas fa-map-marker-slash"></i><p>Места не найдены</p></div>}
        </div>
      </div>

      {/* MODAL */}
      <div className={`modal-overlay${modal?' open':''}`}>
        <div className="modal" style={{maxWidth:680}}>
          <div className="modal-header">
            <h3><i className="fas fa-map-marker-alt" style={{color:'var(--primary)'}}></i> {form.id?'Редактировать место':'Добавить место'}</h3>
            <button className="modal-close" onClick={()=>setModal(false)}><i className="fas fa-times"></i></button>
          </div>
          <div className="modal-body">
            <div className="admin-2col">
              <div className="admin-form-group"><label>Название <span className="req">*</span></label><input className="admin-form-control" value={form.name} onChange={e=>f('name',e.target.value)} placeholder="Иссык-Куль" /></div>
              <div className="admin-form-group"><label>Категория <span className="req">*</span></label>
                <select className="admin-form-control" value={form.cat} onChange={e=>f('cat',e.target.value)}>
                  {CATS.map(c=><option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select></div>
              <div className="admin-form-group"><label>Регион <span className="req">*</span></label><input className="admin-form-control" value={form.region} onChange={e=>f('region',e.target.value)} placeholder="Иссык-Кульская обл." /></div>
              <div className="admin-form-group"><label>Рейтинг</label>
                <select className="admin-form-control" value={form.rating} onChange={e=>f('rating',parseInt(e.target.value))}>
                  {[5,4,3,2,1].map(n=><option key={n} value={n}>{'★'.repeat(n)+' ('+n+')'}</option>)}
                </select></div>
              <div className="admin-form-group"><label>Лучшее время</label><input className="admin-form-control" value={form.bestTime} onChange={e=>f('bestTime',e.target.value)} placeholder="Июнь–Сентябрь" /></div>
              <div className="admin-form-group"><label>Статус</label>
                <select className="admin-form-control" value={form.status} onChange={e=>f('status',e.target.value)}>
                  <option value="active">✅ Активен</option><option value="hidden">🔒 Скрыт</option>
                </select></div>
              <div className="admin-form-group form-full"><label>Транспорт</label><input className="admin-form-control" value={form.transport} onChange={e=>f('transport',e.target.value)} placeholder="Автобус 4-5ч · Такси 2000 сом" /></div>
              <div className="admin-form-group form-full"><label>Описание</label><textarea className="admin-form-control" value={form.desc} onChange={e=>f('desc',e.target.value)} placeholder="Краткое описание места..." /></div>
              <div className="admin-form-group form-full"><label>URL изображения</label><input className="admin-form-control" value={form.img} onChange={e=>f('img',e.target.value)} placeholder="https://images.unsplash.com/..." /></div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-admin btn-admin-ghost" onClick={()=>setModal(false)}>Отмена</button>
            <button className="btn-admin btn-admin-primary" onClick={handleSave}><i className="fas fa-save"></i> Сохранить</button>
          </div>
        </div>
      </div>

      <ConfirmModal open={!!confirm} title="Удалить место?" message={`Удалить «${confirm?.name}»? Это действие нельзя отменить.`} onConfirm={confirmDelete} onCancel={()=>setConfirm(null)} />
    </div>
  )
}
