import { useState, useMemo, useEffect } from 'react';
import proveedorService from '../services/proveedorService';

export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Cargar proveedores al inicializar
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setCargando(true);
    try {
      const datos = await proveedorService.obtenerProveedores();
      setProveedores(datos);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar proveedores por búsqueda
  const proveedoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return proveedores;

    const termino = busqueda.toLowerCase();
    return proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(termino) ||
      (proveedor.telefono && proveedor.telefono.toLowerCase().includes(termino)) ||
      (proveedor.concepto && proveedor.concepto.toLowerCase().includes(termino))
    );
  }, [proveedores, busqueda]);

  // Resultados para el buscador
  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return [];

    return proveedoresFiltrados.map(proveedor => ({
      id: proveedor.id_proveedor,
      label: proveedor.nombre,
      category: 'Proveedor',
      telefono: proveedor.telefono,
      concepto: proveedor.concepto,
      data: proveedor
    }));
  }, [proveedoresFiltrados, busqueda]);

  // CREAR PROVEEDOR
  const crearProveedor = async (nuevoProveedor) => {
    try {
      const proveedorCreado = await proveedorService.crearProveedor(nuevoProveedor);
      setProveedores(prev => [...prev, proveedorCreado]);
      setMostrarForm(false);
      return proveedorCreado;
    } catch (error) {
      console.error('Error creando proveedor:', error);
      throw error;
    }
  };

  // ACTUALIZAR PROVEEDOR
  const actualizarProveedor = async (proveedorActualizado) => {
    try {
      const resultado = await proveedorService.actualizarProveedor(
        proveedorActualizado.id_proveedor,
        {
          nombre: proveedorActualizado.nombre,
          telefono: proveedorActualizado.telefono,
          cantidad: proveedorActualizado.cantidad,
          concepto: proveedorActualizado.concepto,
          precio_unitario: proveedorActualizado.precio_unitario,
          precio_total: proveedorActualizado.precio_total
        }
      );

      setProveedores(prev =>
        prev.map(p =>
          p.id_proveedor === proveedorActualizado.id_proveedor ? resultado : p
        )
      );

      setMostrarForm(false);
      setProveedorEditando(null);
      return true;
    } catch (error) {
      console.error('Error actualizando proveedor:', error);
      throw error;
    }
  };

  const manejarSeleccionResultado = (resultado) => {
    const proveedorEncontrado = proveedores.find(p => p.id_proveedor === resultado.id);
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
    cargando,
    setBusqueda,
    resultadosBusqueda,
    setProveedorEditando,
    setMostrarForm,
    crearProveedor,
    actualizarProveedor,
    manejarSeleccionResultado,
    abrirEditarProveedor,
    recargarProveedores: cargarProveedores
  };
}
