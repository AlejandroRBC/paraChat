import { useState, useEffect } from 'react';

// Datos mock del historial de ventas

const ventasMock = [
  {
    id: 1,
    id_venta: 'V001',
    fecha: '2025-09-15',
    hora: '21:50:00',
    nombre_cliente: 'Victor Hugo',
    ci_nit: '82343471',
    metodo_pago: 'QR',
    total: 5.50,
    productos: 'Azitromicina x1 = 5.50 Bs '
  },
  {
    id: 2,
    id_venta: 'V002',
    fecha: '2025-09-15',
    hora: '18:30:15',
    nombre_cliente: 'Maria Fernandez',
    ci_nit: '65432198',
    metodo_pago: 'Efectivo',
    total: 42.00,
    productos: 'Ibuprofeno x2 = 30.00 Bs, Paracetamol x1 = 12.00 Bs'
  },
  {
    id: 3,
    id_venta: 'V003',
    fecha: '2025-09-14',
    hora: '14:20:45',
    nombre_cliente: 'Carlos Rodriguez',
    ci_nit: '11223344',
    metodo_pago: 'Mixto',
    total: 87.50,
    productos: 'Amoxicilina x3 = 45.00 Bs, Vitamina C x2 = 42.50 Bs'
  },
  {
    id: 4,
    id_venta: 'V004',
    fecha: '2025-09-14',
    hora: '10:15:30',
    nombre_cliente: 'Ana Garcia',
    ci_nit: '55667788',
    metodo_pago: 'QR',
    total: 25.00,
    productos: 'Jarabe para la tos x1 = 25.00 Bs'
  },
  {
    id: 5,
    id_venta: 'V005',
    fecha: '2025-09-13',
    hora: '16:45:20',
    nombre_cliente: 'Luis Martinez',
    ci_nit: '99887766',
    metodo_pago: 'Efectivo',
    total: 68.75,
    productos: 'Antigripal x2 = 35.00 Bs, Analgésico x1 = 33.75 Bs'
  }
];


export const useVentas = () => {
  const [ventas, setearVentas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        // Ordenar por fecha y hora más reciente primero
        const ventasOrdenadas = [...ventasMock].sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`);
          const fechaB = new Date(`${b.fecha} ${b.hora}`);
          return fechaB - fechaA;
        });
        setearVentas(ventasOrdenadas);

        setearVentas(ventasOrdenadas);
      } catch (err) {
        setError('Error al cargar el historial de ventas');
        console.error('Error:', err);
      }
    };
    cargarVentas();

  }, []);

  const buscarVentas = (termino) => {
    // Lógica de búsqueda (se puede implementar después)
    console.log('Buscando:', termino);
  };

  const filtrarPorFecha = (fechaInicio, fechaFin) => {
    // Lógica de filtrado por fecha (se puede implementar después)
    console.log('Filtrando por fecha:', fechaInicio, fechaFin);
  };

  return {
    ventas,
    error,
    buscarVentas,
    filtrarPorFecha
  };
};