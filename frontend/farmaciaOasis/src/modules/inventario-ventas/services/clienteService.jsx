// Agrega esta función:
obtenerClientePorCI: async (ci_nit) => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      const clientes = response.data.data;
      return clientes.find(cliente => cliente.ci_nit === ci_nit && cliente.estado === 'activo');
    } catch (error) {
      console.error('Error al buscar cliente por CI:', error);
      throw error;
    }
  }