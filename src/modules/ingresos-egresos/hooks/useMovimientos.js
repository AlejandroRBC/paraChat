import { useState, useEffect } from 'react';

// Datos mock de movimientos de productos
const movimientosMock = [
  {
    id: 1,
    id_producto: 1,
    nombre: 'Paracetamol',
    presentacion: 'Jarabe',
    lote: '123',
    precio_venta: 3.50,
    stock_antiguo: 6,
    stock_nuevo: 5,
    fecha: '2025-09-15',
    hora: '22:00:00',
    laboratorio: 'Laboratorio ABC',
    tipo: 'egreso'
  },
  {
    id: 2,
    id_producto: 1,
    nombre: 'Paracetamol',
    presentacion: 'Jarabe',
    lote: '123',
    precio_venta: 3.50,
    stock_antiguo: 5,
    stock_nuevo: 15,
    fecha: '2025-09-14',
    hora: '10:30:00',
    laboratorio: 'Laboratorio ABC',
    tipo: 'ingreso'
  },
  {
    id: 3,
    id_producto: 2,
    nombre: 'Ibuprofeno',
    presentacion: 'Tabletas',
    lote: '456',
    precio_venta: 15.00,
    stock_antiguo: 20,
    stock_nuevo: 18,
    fecha: '2025-09-15',
    hora: '18:45:00',
    laboratorio: 'Lab Farma',
    tipo: 'egreso'
  },
  {
    id: 4,
    id_producto: 3,
    nombre: 'Amoxicilina',
    presentacion: 'Cápsulas',
    lote: '789',
    precio_venta: 25.00,
    stock_antiguo: 10,
    stock_nuevo: 30,
    fecha: '2025-09-13',
    hora: '14:20:00',
    laboratorio: 'Lab Salud',
    tipo: 'ingreso'
  },
  {
    id: 5,
    id_producto: 4,
    nombre: 'Vitamina C',
    presentacion: 'Tabletas Masticables',
    lote: '101',
    precio_venta: 21.25,
    stock_antiguo: 25,
    stock_nuevo: 22,
    fecha: '2025-09-15',
    hora: '16:30:00',
    laboratorio: 'Lab Farma',
    tipo: 'egreso'
  },
  {
    id: 6,
    id_producto: 2,
    nombre: 'Ibuprofeno',
    presentacion: 'Tabletas',
    lote: '456',
    precio_venta: 15.00,
    stock_antiguo: 18,
    stock_nuevo: 50,
    fecha: '2025-09-12',
    hora: '09:15:00',
    laboratorio: 'Lab Farma',
    tipo: 'ingreso'
  },
  {
    id: 7,
    id_producto: 5,
    nombre: 'Jarabe para la Tos',
    presentacion: 'Botella 120ml',
    lote: '202',
    precio_venta: 25.00,
    stock_antiguo: 8,
    stock_nuevo: 5,
    fecha: '2025-09-14',
    hora: '20:10:00',
    laboratorio: 'Laboratorio ABC',
    tipo: 'egreso'
  },
  {
    id: 8,
    id_producto: 99,
    nombre: 'Jarabe para la Tos',
    presentacion: 'Botella 120ml',
    lote: '202',
    precio_venta: 25.00,
    stock_antiguo: 8,
    stock_nuevo: 5,
    fecha: '2025-10-15',
    hora: '20:10:00',
    laboratorio: 'Laboratorio ABC',
    tipo: 'egreso'
  }
];
export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular llamada a API con timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ordenar por fecha y hora más reciente primero
      const movimientosOrdenados = [...movimientosMock].sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaB - fechaA; // Más reciente primero
      });

      setMovimientos(movimientosOrdenados);
    } catch (err) {
      setError('Error al cargar los movimientos de productos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  // Función para buscar movimientos por nombre y lote
  const buscarMovimientos = (terminoBusqueda) => {
    if (!terminoBusqueda) return movimientos; // Si no hay búsqueda, devolver todos

    const termino = terminoBusqueda.toLowerCase().trim();

    return movimientos.filter(movimiento =>
      movimiento.nombre.toLowerCase().includes(termino) ||
      movimiento.lote.toLowerCase().includes(termino)
    );
  };

  // Función para recargar los datos
  const refetch = () => {
    cargarMovimientos();
  };
  
  return {
    movimientos,
    loading,
    error,
    refetch,
    buscarMovimientos
  };
  
};