import { useState, useEffect, useCallback } from 'react'

let _showToast = null
export function showToast(msg, type = '') {
  if (_showToast) _showToast(msg, type)
}

export default function Toast() {
  const [state, setState] = useState({ msg: '', type: '', show: false })
  useEffect(() => {
    _showToast = (msg, type) => {
      setState({ msg, type, show: true })
      setTimeout(() => setState(s => ({ ...s, show: false })), 3200)
    }
    return () => { _showToast = null }
  }, [])
  return (
    <div className={`toast${state.show ? ' show' : ''}${state.type ? ' ' + state.type : ''}`}>
      <i className={`fas fa-${state.type === 'success' ? 'check-circle' : state.type === 'error' ? 'times-circle' : 'info-circle'}`}></i>
      {state.msg}
    </div>
  )
}
