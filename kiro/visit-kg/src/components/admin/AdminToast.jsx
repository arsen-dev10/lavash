import { useState, useEffect } from 'react'

let _show = null
export function adminToast(msg, type = 'ok') {
  if (_show) _show(msg, type)
}

export default function AdminToast() {
  const [state, setState] = useState({ msg: '', type: '', show: false })
  useEffect(() => {
    _show = (msg, type) => {
      setState({ msg, type, show: true })
      setTimeout(() => setState(s => ({ ...s, show: false })), 3200)
    }
    return () => { _show = null }
  }, [])
  const icons = { ok: 'check-circle', err: 'times-circle', warn: 'exclamation-triangle' }
  return (
    <div className={`admin-toast${state.show ? ' show' : ''}${state.type ? ' ' + state.type : ''}`}>
      <i className={`fas fa-${icons[state.type] || 'info-circle'}`}></i>
      {state.msg}
    </div>
  )
}
