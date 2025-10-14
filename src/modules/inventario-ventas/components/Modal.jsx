function Modal({ 
  titulo, 
  children, 
  onClose, 
  tamaño = 'normal' }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${tamaño === 'grande' ? 'grande' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{titulo}</h2>
          <button className="btn-cerrar" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;