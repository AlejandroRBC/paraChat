import { useState, useMemo, useEffect } from 'react';
import clienteService from '../services/clienteService';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Cargar clientes al inicializar
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setCargando(true);
    try {
      const datos = await clienteService.obtenerClientes();
      setClientes(datos);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar solo clientes ACTIVOS
  const clientesActivos = useMemo(() => {
    return clientes.filter(cliente => cliente.estado === 'activo');
  }, [clientes]);

  // Filtrar clientes por búsqueda (solo activos)
  const clientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return clientesActivos;
    
    const termino = busqueda.toLowerCase();
    return clientesActivos.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino) ||
      (cliente.ci_nit && cliente.ci_nit.toLowerCase().includes(termino))
    );
  }, [clientesActivos, busqueda]);

  // Buscar cliente inactivo por CI/NIT
  const buscarClienteInactivoPorCI = (ci_nit) => {
    return clientes.find(cliente => 
      cliente.ci_nit === ci_nit && cliente.estado === 'inactivo'
    );
  };

  // CREAR CLIENTE
  const crearCliente = async (nuevoCliente) => {
    try {
      // Buscar si existe cliente inactivo con mismo CI/NIT
      const clienteInactivo = buscarClienteInactivoPorCI(nuevoCliente.ci_nit);
      
      if (clienteInactivo) {
        // Reactivar el cliente existente
        const clienteReactivado = await clienteService.actualizarCliente(
          clienteInactivo.cod_cli, 
          {
            nombre: nuevoCliente.nombre,
            ci_nit: nuevoCliente.ci_nit,
            descuento: nuevoCliente.descuento,
            estado: 'activo'
          }
        );
        
        setClientes(prev => prev.map(c => 
          c.cod_cli === clienteInactivo.cod_cli ? clienteReactivado : c
        ));
        setMostrarForm(false);
        return clienteReactivado;
      } else {
        // Crear nuevo cliente
        const clienteCreado = await clienteService.crearCliente(nuevoCliente);
        setClientes(prev => [...prev, clienteCreado]);
        setMostrarForm(false);
        return clienteCreado;
      }
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  };

  // ACTUALIZAR CLIENTE
  const actualizarCliente = async (clienteActualizado) => {
    try {
      const resultado = await clienteService.actualizarCliente(
        clienteActualizado.cod_cli, 
        {
          nombre: clienteActualizado.nombre,
          ci_nit: clienteActualizado.ci_nit,
          descuento: clienteActualizado.descuento,
          estado: clienteActualizado.estado
        }
      );
      
      setClientes(prev => prev.map(c => 
        c.cod_cli === clienteActualizado.cod_cli ? resultado : c
      ));
      
      setMostrarForm(false);
      setClienteEditando(null);
      return true;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  };

  // ELIMINAR CLIENTE
  const eliminarCliente = async (id) => {
    try {
      await clienteService.eliminarCliente(id);
      
      // Actualizar estado localmente 
      setClientes(prev => prev.map(c => 
        c.cod_cli === id ? { ...c, estado: 'inactivo' } : c
      ));
      
      setMostrarConfirmacion(false);
      setClienteAEliminar(null);
      return true;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  };

  const solicitarEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarConfirmacion(true);
  };

  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setClienteAEliminar(null);
  };

  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarForm(true);
  };

  return {
    clientes: clientesFiltrados, // ← Esto ahora son solo los activos filtrados
    clienteEditando,
    mostrarForm,
    busqueda,
    cargando,
    setBusqueda,
    clienteAEliminar,
    mostrarConfirmacion,
    setClienteEditando,
    setMostrarForm,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    solicitarEliminacion,
    cancelarEliminacion,
    abrirEditarCliente,
    recargarClientes: cargarClientes
  };
}