import { useState, useMemo } from 'react';

const proveedoresIniciales = [
  { id: 1, empresa: 'Distribuidora ABC', contacto: 'Roberto Martínez', email: 'roberto@abc.com', telefono: '111222333', estado: 'activo' },
  { id: 2, empresa: 'Suministros XYZ', contacto: 'Laura González', email: 'laura@xyz.com', telefono: '444555666', estado: 'activo' },
  { id: 3, empresa: 'Importaciones Global', contacto: 'Carlos Rodríguez', email: 'carlos@global.com', telefono: '777888999', estado: 'activo' },
];

export function useProveedores() {
  const [proveedores, setProveedores] = useState(proveedoresIniciales);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // ← ESTADO DEL MODAL

  // Filtrar solo proveedores activos
  const proveedoresFiltrados = useMemo(() => {
    const proveedoresActivos = proveedores.filter(proveedor => proveedor.estado === 'activo');
    
    if (!busqueda.trim()) return proveedoresActivos;
    
    const termino = busqueda.toLowerCase();
    return proveedoresActivos.filter(proveedor => 
      proveedor.empresa.toLowerCase().includes(termino) ||
      proveedor.contacto.toLowerCase().includes(termino) ||
      proveedor.email.toLowerCase().includes(termino) ||
      proveedor.telefono.includes(termino)
    );
  }, [proveedores, busqueda]);

  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return [];
    
    return proveedoresFiltrados.map(proveedor => ({
      id: proveedor.id,
      label: proveedor.empresa,
      category: 'Proveedor',
      contacto: proveedor.contacto,
      email: proveedor.email,
      telefono: proveedor.telefono,
      data: proveedor
    }));
  }, [proveedoresFiltrados, busqueda]);

  const crearProveedor = (nuevoProveedor) => {
    const proveedor = {
      ...nuevoProveedor,
      id: Math.max(0, ...proveedores.map(p => p.id)) + 1,
      estado: 'activo'
    };
    setProveedores([...proveedores, proveedor]);
    setMostrarForm(false);
  };

  const actualizarProveedor = (proveedorActualizado) => {
    setProveedores(proveedores.map(p => 
      p.id === proveedorActualizado.id ? { ...proveedorActualizado, estado: 'activo' } : p
    ));
    setMostrarForm(false);
  };

  // Eliminación suave
  const eliminarProveedor = (id) => {
    setProveedores(proveedores.map(p => 
      p.id === id ? { ...p, estado: 'desactivado' } : p
    ));
    setMostrarConfirmacion(false);
    setProveedorAEliminar(null);
  };

  // Abrir modal de confirmación
  const solicitarEliminacion = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarConfirmacion(true);
  };

  // Cerrar modal de confirmación
  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setProveedorAEliminar(null);
  };

  const manejarSeleccionResultado = (resultado) => {
    const proveedorEncontrado = proveedores.find(p => p.id === resultado.id && p.estado === 'activo');
    if (proveedorEncontrado) {
      abrirEditarProveedor(proveedorEncontrado);
    }
  };

  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarForm(true);
  };

  return {
    proveedores: proveedoresFiltrados,
    proveedoresOriginales: proveedores,
    proveedorEditando,
    mostrarForm,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    proveedorAEliminar,
    mostrarConfirmacion,
    setProveedorEditando,
    setMostrarForm,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    solicitarEliminacion,
    cancelarEliminacion,
    manejarSeleccionResultado,
  };
}