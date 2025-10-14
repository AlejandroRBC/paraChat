import { useState } from 'react'; // Importamos el hook useState de React

// Custom Hook que gestiona el estado de todos los modales
export const useModales = () => {
  // Estado para el modal de producto (puede tener un producto para editar)
  const [modalProducto, setModalProducto] = useState({
    abierto: false,    // Inicialmente cerrado
    producto: null     // Sin producto seleccionado
  });
  
  // Estados simples para los otros modales
  const [modalLaboratorio, setModalLaboratorio] = useState(false); // Cerrado inicialmente
  const [modalVenta, setModalVenta] = useState(false); // Cerrado inicialmente

  // Función para abrir el modal de producto
  const abrirModalProducto = (producto = null) => {
    setModalProducto({ 
      abierto: true,   // Abre el modal
      producto         // Si se pasa un producto, lo guarda para editar
    });
  };

  // Función para cerrar el modal de producto
  const cerrarModalProducto = () => {
    setModalProducto({ 
      abierto: false,  // Cierra el modal
      producto: null   // Limpia el producto
    });
  };

  // Funciones para abrir/cerrar modal de laboratorio
  const abrirModalLaboratorio = () => setModalLaboratorio(true);
  const cerrarModalLaboratorio = () => setModalLaboratorio(false);
  
  // Funciones para abrir/cerrar modal de venta
  const abrirModalVenta = () => setModalVenta(true);
  const cerrarModalVenta = () => setModalVenta(false);

  // Retornamos todos los estados y funciones para usar en el componente
  return {
    // Estados actuales de los modales
    modalProducto,
    modalLaboratorio,
    modalVenta,
    
    // Funciones para controlar los modales
    abrirModalProducto,
    cerrarModalProducto,
    abrirModalLaboratorio,
    cerrarModalLaboratorio,
    abrirModalVenta,
    cerrarModalVenta
  };
};