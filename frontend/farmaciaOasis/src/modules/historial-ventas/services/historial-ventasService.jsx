//src/modules/historial-ventas/services/historial-ventasService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';  

const HistorialVentasService = {
  // Obtener todas las ventas con detalle de productos y cliente
  obtenerVentasDetalle: async () => {
    try {
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      console.log('Respuesta completa del backend:', response);
      
      // Ajusta según la estructura real de tu respuesta
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      throw error;
    }
  },

  // Función alternativa que puede usar el hook
  obtenerVentas: async () => {
    try {
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      console.log('Datos de ventas obtenidos:', response.data);
      
      // Ajusta según tu estructura de respuesta
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      throw error;
    }
  },

  // Filtrar ventas por cliente
  obtenerVentasPorCliente: async (id_cliente) => {
    try {
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      const ventas = response.data.data || response.data;
      return ventas.filter(v => v.id_cliente === id_cliente);
    } catch (error) {
      console.error("Error al filtrar ventas por cliente:", error);
      throw error;
    }
  },

  // Filtrar ventas por rango de fechas
  obtenerVentasPorFecha: async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      const ventas = response.data.data || response.data;
      return ventas.filter(v => v.fecha >= fechaInicio && v.fecha <= fechaFin);
    } catch (error) {
      console.error("Error al filtrar ventas por fecha:", error);
      throw error;
    }
  }
};

export default HistorialVentasService;