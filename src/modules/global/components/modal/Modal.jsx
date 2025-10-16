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
    <div className="mantine-modal-overlay" onClick={handleOverlayClick}>
      <div className={`mantine-modal-content ${tamaño === 'grande' ? 'grande' : ''}`}>
        <div className="mantine-modal-header">
          <h2 className="mantine-modal-title">{titulo}</h2>
          <button className="btn-cerrar" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>
        <div className="mantine-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;