import { useState } from 'react';
import inventarioService from '../services/InventarioService';

export const useCarrito = () => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        // Verificar stock disponible
        if (existe.cantidad + 1 > producto.stock) {
          alert(`No hay suficiente stock. Stock disponible: ${producto.stock}`);
          return prev;
        }
        return prev.map(item =>
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Verificar stock para nuevo item
      if (1 > producto.stock) {
        alert(`No hay suficiente stock. Stock disponible: ${producto.stock}`);
        return prev;
      }
      return [...prev, { 
        ...producto, 
        cantidad: 1,
        id_producto: producto.id // Para la base de datos
      }];
    });
  };

  const modificarCantidad = (id, cambio) => {
    setCarrito(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          
          // Verificar que no sea menor a 1
          if (nuevaCantidad < 1) return null;
          
          // Verificar stock disponible
          if (nuevaCantidad > item.stock) {
            alert(`No hay suficiente stock. Stock disponible: ${item.stock}`);
            return item;
          }
          
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const realizarVenta = async (datosCliente) => {
    try {
      // Determinar el id_cliente
      let id_cliente;
      
      if (datosCliente.ci_nit === '00000' || datosCliente.nombre === 'S/N') {
        id_cliente = 0; // venta rápida
      } else {
        id_cliente = await obtenerOcrearCliente(datosCliente);
      }
  
      // Preparar datos de la venta
      const ventaData = {
        total: totalVenta,
        metodo_pago: datosCliente.metodo_pago,
        id_cliente: id_cliente,     // <--- AQUÍ se envía
        items: carrito.map(item => ({
          id_producto: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio_venta: item.precio_venta
        }))
      };
  
      const resultado = await inventarioService.crearVenta(ventaData);
      return resultado;
    } catch (error) {
      console.error('Error realizando venta:', error);
      throw error;
    }
  };
  

  // Función para obtener o crear cliente
const obtenerOcrearCliente = async (datosCliente) => {
  try {
    // Primero buscar si el cliente ya existe por CI/NIT
    const clienteExistente = await inventarioService.buscarClientePorCI(datosCliente.ci_nit);
    
    if (clienteExistente) {
      return clienteExistente.cod_cli;
    } else {
      // Crear nuevo cliente
      const nuevoCliente = await inventarioService.crearCliente({
        nombre: datosCliente.nombre,
        ci_nit: datosCliente.ci_nit,
        descuento: 0,
        estado: 'activo'
      });
      return nuevoCliente.cod_cli;
    }
  } catch (error) {
    console.error('Error al obtener/crear cliente:', error);
    // En caso de error, usar el cliente especial para venta rápida
    return 0;
  }
};

  // Función auxiliar para buscar cliente por CI/NIT (simplificada)
  const obtenerIdCliente = (ci_nit) => {
    // En una implementación real, aquí buscarías el cliente en la base de datos
    // Por ahora retornamos null y manejamos clientes nuevos
    return null;
  };

  const totalVenta = carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);

  return {
    carrito,
    agregarAlCarrito,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    realizarVenta,
    totalVenta
  };
};