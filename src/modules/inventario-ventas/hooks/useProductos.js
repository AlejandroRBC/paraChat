import { useState, useEffect } from 'react';
import inventarioService from '../services/InventarioService';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarProductos();
    cargarLaboratorios();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const datos = await inventarioService.obtenerProductos();
      // Mapear los datos de la base de datos al formato esperado por el frontend
      const productosMapeados = datos.map(producto => ({
        id: producto.id_producto,
        codigo: producto.codigo || `PROD${String(producto.id_producto).padStart(3, '0')}`,
        lote: producto.lote,
        nombre: producto.nombre_prod,
        presentacion: producto.presentacion,
        precio_base: producto.precio_compra,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        fecha_expiracion: producto.fecha_exp,
        laboratorio: producto.laboratorio_nombre || producto.nombre_labo,
        porcentaje_g: producto.porcentaje_g,
        estado: producto.estado === 'activo' ? 'activado' : 'desactivado',
        id_lab: producto.id_lab,
        id_proveedor: producto.id_proveedor
      }));
      setProductos(productosMapeados);
    } catch (error) {
      console.error('Error cargando productos:', error);
      // En caso de error, usar datos mock como fallback
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  const cargarLaboratorios = async () => {
    try {
      const datos = await inventarioService.obtenerLaboratorios();
      setLaboratorios(datos);
    } catch (error) {
      console.error('Error cargando laboratorios:', error);
      // Datos mock como fallback
      setLaboratorios([
        { id: 1, nombre: 'Lab Farma', direccion: 'Av. Principal 123' },
        { id: 2, nombre: 'Lab Salud', direccion: 'Calle Secundaria 456' }
      ]);
    }
  };

  const agregarProducto = async (nuevoProducto) => {
    try {
      // El precio_venta ahora viene calculado desde el formulario
      const productoData = {
        nombre_prod: nuevoProducto.nombre,
        lote: nuevoProducto.lote,
        fecha_exp: nuevoProducto.fecha_expiracion,
        porcentaje_g: nuevoProducto.porcentaje_g,
        stock: parseInt(nuevoProducto.stock),
        presentacion: nuevoProducto.presentacion,
        precio_venta: parseFloat(nuevoProducto.precio_venta), // Usar el precio calculado
        precio_compra: parseFloat(nuevoProducto.precio_compra),
        valor_medida: 0,
        id_lab: obtenerIdLaboratorio(nuevoProducto.laboratorio),
        id_proveedor: 1
      };
  
      const productoGuardado = await inventarioService.crearProducto(productoData);
      
      const productoFrontend = {
        id: productoGuardado.id_producto,
        codigo: `PROD${String(productoGuardado.id_producto).padStart(3, '0')}`,
        lote: productoGuardado.lote,
        nombre: productoGuardado.nombre_prod,
        presentacion: productoGuardado.presentacion,
        precio_base: productoGuardado.precio_compra, // Mostrar precio_compra como precio_base
        precio_venta: productoGuardado.precio_venta,
        stock: productoGuardado.stock,
        fecha_expiracion: productoGuardado.fecha_exp,
        laboratorio: nuevoProducto.laboratorio,
        porcentaje_g: productoGuardado.porcentaje_g,
        estado: 'activado'
      };
  
      setProductos(prev => [...prev, productoFrontend]);
      return productoFrontend;
    } catch (error) {
      console.error('Error agregando producto:', error);
      throw error;
    }
  };
  
  const actualizarProducto = async (id, datosActualizados) => {
    try {
      const productoData = {
        nombre_prod: datosActualizados.nombre,
        lote: datosActualizados.lote,
        fecha_exp: datosActualizados.fecha_expiracion,
        porcentaje_g: datosActualizados.porcentaje_g,
        stock: parseInt(datosActualizados.stock),
        presentacion: datosActualizados.presentacion,
        precio_venta: parseFloat(datosActualizados.precio_venta), // Usar el precio calculado
        precio_compra: parseFloat(datosActualizados.precio_compra),
        valor_medida: 0,
        estado: 'activo',
        id_lab: obtenerIdLaboratorio(datosActualizados.laboratorio),
        id_proveedor: 1
      };
  
      const productoActualizado = await inventarioService.actualizarProducto(id, productoData);
      
      setProductos(prev => prev.map(p => 
        p.id === id ? { 
          ...p, 
          ...datosActualizados,
          precio_base: productoActualizado.precio_compra,
          precio_venta: productoActualizado.precio_venta,
          stock: productoActualizado.stock
        } : p
      ));
      
      return productoActualizado;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  };

  const desactivarProducto = async (id) => {
    try {
      await inventarioService.eliminarProducto(id);
      setProductos(prev => prev.map(p => 
        p.id === id ? { ...p, estado: 'desactivado' } : p
      ));
    } catch (error) {
      console.error('Error desactivando producto:', error);
      throw error;
    }
  };

  const reactivarProducto = async (id) => {
    try {
      const producto = productos.find(p => p.id === id);
      if (producto) {
        await inventarioService.actualizarProducto(id, {
          nombre_prod: producto.nombre,
          lote: producto.lote,
          fecha_exp: producto.fecha_expiracion,
          porcentaje_g: producto.porcentaje_g,
          stock: producto.stock,
          presentacion: producto.presentacion,
          precio_venta: producto.precio_venta,
          precio_compra: producto.precio_base,
          valor_medida: 0,
          estado: 'activo',
          id_lab: producto.id_lab,
          id_proveedor: producto.id_proveedor
        });
        
        setProductos(prev => prev.map(p => 
          p.id === id ? { ...p, estado: 'activado' } : p
        ));
      }
    } catch (error) {
      console.error('Error reactivando producto:', error);
      throw error;
    }
  };

  const agregarLaboratorio = async (nuevoLab) => {
    try {
      const laboratorioGuardado = await inventarioService.crearLaboratorio(nuevoLab);
      setLaboratorios(prev => [...prev, laboratorioGuardado]);
      return laboratorioGuardado;
    } catch (error) {
      console.error('Error agregando laboratorio:', error);
      throw error;
    }
  };

  // Función auxiliar para obtener ID del laboratorio por nombre
  const obtenerIdLaboratorio = (nombreLaboratorio) => {
    const laboratorio = laboratorios.find(lab => lab.nombre === nombreLaboratorio);
    return laboratorio ? laboratorio.id : 1; // Default al primer laboratorio
  };

  return {
    productos,
    laboratorios,
    cargando,
    agregarProducto,
    actualizarProducto,
    desactivarProducto,
    reactivarProducto,
    agregarLaboratorio,
    recargarProductos: cargarProductos,
    recargarLaboratorios: cargarLaboratorios
  };
};