import classes from './Modal.module.css';
function Modal({ titulo, children, onClose, tamaño = 'normal', opened = true }) {
  if (!opened) return null; // modal invisible si opened=false

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={classes.globModalOverlay} onClick={handleOverlayClick}>
      <div className={`${classes.globModalContent} ${tamaño === 'grande' ? classes.grande : ''}`}>
        <div className={classes.globModalHeader}>
          <h2 className={classes.globModalTitle}>{titulo}</h2>
          <button className={classes.btnCerrar} onClick={onClose} aria-label="Cerrar">&times;</button>
        </div>
        <div className={classes.globModalBody}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;