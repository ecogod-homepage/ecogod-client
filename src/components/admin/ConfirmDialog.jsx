export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  destructive = false,
  onConfirm,
  onCancel
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="admin-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
      <div className="admin-dialog">
        <h2 id="admin-dialog-title" className="heading-3 admin-dialog-title">
          {title}
        </h2>
        <p className="body-text admin-dialog-message">{message}</p>
        <div className="admin-dialog-actions">
          <button type="button" className="btn btn-outline admin-btn-lg" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn admin-btn-lg ${destructive ? "admin-btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
