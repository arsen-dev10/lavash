export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmLabel = 'Удалить' }) {
  if (!open) return null
  return (
    <div className={`confirm-overlay${open ? ' open' : ''}`}>
      <div className="confirm-box">
        <div className="icon">⚠️</div>
        <h3>{title || 'Вы уверены?'}</h3>
        <p>{message}</p>
        <div className="confirm-btns">
          <button className="btn-admin btn-admin-ghost" onClick={onCancel}>Отмена</button>
          <button className="btn-admin btn-admin-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
