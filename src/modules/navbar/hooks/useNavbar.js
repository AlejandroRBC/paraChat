import { useState, useEffect } from 'react';

export const useNavbar = () => {
  const [esMenuAbierto, setEsMenuAbierto] = useState(false);

  const abrirMenu = () => {
    setEsMenuAbierto(true);
    document.body.style.overflow = 'hidden';
  };

  const cerrarMenu = () => {
    setEsMenuAbierto(false);
    document.body.style.overflow = 'unset';
  };

  const toggleMenu = () => {
    if (esMenuAbierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  };

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    // También cerrar con la tecla Escape
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        cerrarMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return {
    esMenuAbierto,
    abrirMenu,
    cerrarMenu,
    toggleMenu
  };
};