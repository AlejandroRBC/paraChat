// services/dashboardService.js
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export const dashboardService = {
  // 1. Obtener métricas del día (ventas hoy vs ayer) - BD REAL
  async obtenerMetricasHoy() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/metricas-hoy`);
      return response.data.data || {
        totalHoy: 0,
        totalAyer: 0,
        productosHoy: 0,
        productosAyer: 0,
        ventasHoy: 0,
        ventasAyer: 0
      };
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      return {
        totalHoy: 0,
        totalAyer: 0,
        productosHoy: 0,
        productosAyer: 0,
        ventasHoy: 0,
        ventasAyer: 0
      };
    }
  },

  // 2. Obtener productos con stock bajo (stock ≤ 10) - BD REAL
  async obtenerProductosStockBajo() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/productos-stock-bajo`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo productos stock bajo:', error);
      return [];
    }
  },

  // 3. Obtener productos próximos a vencer (días restantes ≤ 30) - BD REAL
  async obtenerProductosPorVencer() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/productos-por-vencer`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo productos por vencer:', error);
      return [];
    }
  },

  // 4. Obtener ventas mensuales para la gráfica - BD REAL
  async obtenerVentasMensuales() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/ventas-mensuales`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo ventas mensuales:', error);
      return [];
    }
  },

  // 5. Obtener top productos más vendidos - BD REAL
  async obtenerTopProductos() {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/top-productos`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo top productos:', error);
      return [];
    }
  }
};