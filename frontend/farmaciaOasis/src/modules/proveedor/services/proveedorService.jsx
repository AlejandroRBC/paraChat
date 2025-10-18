import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const proveedorService = {
  // GET todos los proveedores
  obtenerProveedores: async () => {
    try {
      const response = await axios.get(`${API_URL}/proveedores`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },

  // GET proveedor por ID
  obtenerProveedor: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/proveedores/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      throw error;
    }
  },

  // POST crear proveedor
  crearProveedor: async (proveedorData) => {
    try {
      const response = await axios.post(`${API_URL}/proveedores`, proveedorData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  },

  // PUT actualizar proveedor
  actualizarProveedor: async (id, proveedorData) => {
    try {
      const response = await axios.put(`${API_URL}/proveedores/${id}`, proveedorData);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  },

  // DELETE proveedor (eliminación suave)
  eliminarProveedor: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/proveedores/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  }
};

export default proveedorService;