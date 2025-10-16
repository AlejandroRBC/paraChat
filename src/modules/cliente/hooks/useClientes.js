import { useState, useMemo } from 'react';

const clientesIniciales = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123456789', estado: 'activo' },
  { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '987654321', estado: 'activo' },
  { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '555555555', estado: 'activo' },
];

export function useClientes() {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // ← ESTADO DEL MODAL

  // Filtrar solo clientes activos
  const clientesFiltrados = useMemo(() => {
    const clientesActivos = clientes.filter(cliente => cliente.estado === 'activo');
    
    if (!busqueda.trim()) return clientesActivos;
    
    const termino = busqueda.toLowerCase();
    return clientesActivos.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.email.toLowerCase().includes(termino) ||
      cliente.telefono.includes(termino)
    );
  }, [clientes, busqueda]);

  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return [];
    
    return clientesFiltrados.map(cliente => ({
      id: cliente.id,
      label: cliente.nombre,
      category: 'Cliente',
      email: cliente.email,
      telefono: cliente.telefono,
      data: cliente
    }));
  }, [clientesFiltrados, busqueda]);

  const crearCliente = (nuevoCliente) => {
    const cliente = {
      ...nuevoCliente,
      id: Math.max(0, ...clientes.map(c => c.id)) + 1,
      estado: 'activo'
    };
    setClientes([...clientes, cliente]);
    setMostrarForm(false);
  };

  const actualizarCliente = (clienteActualizado) => {
    setClientes(clientes.map(c => 
      c.id === clienteActualizado.id ? { ...clienteActualizado, estado: 'activo' } : c
    ));
    setMostrarForm(false);
  };

  // Eliminación suave (cambia estado a 'desactivado')
  const eliminarCliente = (id) => {
    setClientes(clientes.map(c => 
      c.id === id ? { ...c, estado: 'desactivado' } : c
    ));
    setMostrarConfirmacion(false); // ← Cerrar modal después de eliminar
    setClienteAEliminar(null);
  };

  // Abrir modal de confirmación
  const solicitarEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarConfirmacion(true); // ← Abrir modal
  };

  // Cerrar modal de confirmación
  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false); // ← Cerrar modal
    setClienteAEliminar(null);
  };

  const manejarSeleccionResultado = (resultado) => {
    const clienteEncontrado = clientes.find(c => c.id === resultado.id && c.estado === 'activo');
    if (clienteEncontrado) {
      abrirEditarCliente(clienteEncontrado);
    }
  };

  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarForm(true);
  };

  return {
    clientes: clientesFiltrados,
    clientesOriginales: clientes,
    clienteEditando,
    mostrarForm,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    clienteAEliminar,
    mostrarConfirmacion, // ← Exportar este estado
    setClienteEditando,
    setMostrarForm,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    solicitarEliminacion, // ← Exportar esta función
    cancelarEliminacion,  // ← Exportar esta función
    manejarSeleccionResultado,
  };
}