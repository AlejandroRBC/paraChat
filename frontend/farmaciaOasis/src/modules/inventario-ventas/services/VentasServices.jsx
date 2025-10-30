import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const ventasService = {
  
  // Buscar o crear cliente
  buscarOCrearCliente: async (datosCliente) => {
    try {
      // Si es venta rápida (CI = '123' o 'S/N'), retornar null (sin cliente)
      if (datosCliente.ci_nit === '123' || datosCliente.ci_nit === 'S/N' || !datosCliente.ci_nit || datosCliente.ci_nit.trim() === '') {
        return null;
      }

      // Buscar cliente por CI/NIT
      const response = await axios.get(`${API_URL}/clientes`);
      const clientes = response.data.data;
      const clienteExistente = clientes.find(cliente => 
        cliente.ci_nit === datosCliente.ci_nit && cliente.estado === 'activo'
      );

      if (clienteExistente) {
        console.log('Cliente existente encontrado:', clienteExistente);
        return clienteExistente.cod_cli; // ✅ Retornar solo el ID
      }

      // Si no existe, crear nuevo cliente SOLO si tiene nombre y CI válidos
      if (datosCliente.nombre && datosCliente.nombre.trim() !== '' && 
          datosCliente.ci_nit && datosCliente.ci_nit.trim() !== '') {
        
        const nuevoCliente = {
          nombre: datosCliente.nombre.trim(),
          ci_nit: datosCliente.ci_nit.trim(),
          descuento: 0
        };

        console.log('Creando nuevo cliente:', nuevoCliente);
        const crearResponse = await axios.post(`${API_URL}/clientes`, nuevoCliente);
        return crearResponse.data.data.cod_cli; // ✅ Retornar solo el ID
      }

      // Si no tiene datos válidos para crear cliente, retornar null
      return null;

    } catch (error) {
      console.error('Error al buscar/crear cliente:', error);
      // En caso de error, continuar con la venta sin cliente
      return null;
    }
  },

  // Crear nueva venta
  crearVenta: async (ventaData) => {
    try {
      const response = await axios.post(`${API_URL}/ventas`, ventaData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear venta:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Error al procesar la venta. Intente nuevamente.');
      }
    }
  },

  

  // Obtener todas las ventas
  obtenerVentas: async () => {
    try {
      const response = await axios.get(`${API_URL}/ventas`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  },  

  // Obtener detalles de una venta específica
  obtenerVenta: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ventas/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener venta:', error);
      throw error;
    }
  }
};

export default ventasService;