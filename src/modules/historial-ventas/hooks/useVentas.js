import { useState, useEffect, useMemo } from 'react'; // ✅ Añadir useMemo

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
  },
  {
    id: 6,
    id_venta: 'V006',
    fecha: '2025-10-14',
    hora: '16:45:20',
    nombre_cliente: 'Jose Jose',
    ci_nit: '23841234',
    metodo_pago: 'QR',
    total: 3000.00,
    productos: 'Mentisan plus = 18.00 Bs, Sanatusin x1 = 4.75 Bs'
  }
];

export const useVentas = () => {
  const [ventas, setearVentas] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('general');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);

  const buscarSoloMedicamentos = (productos, textoBusqueda) => {
    if (!productos) return false;
    
    const textoProductos = productos.toLowerCase();
    const medicamentos = textoProductos.split(',');
    
    return medicamentos.some(medicamento => {
      const nombreMedicamento = medicamento
        .split('x')[0] 
        .split('=')[0]  
        .trim();
      
      return nombreMedicamento.includes(textoBusqueda);
    });
  };

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const ventasOrdenadas = [...ventasMock].sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`);
          const fechaB = new Date(`${b.fecha} ${b.hora}`);
          return fechaB - fechaA;
        });
        
        setearVentas(ventasOrdenadas);
      } catch (err) {
        setError('Error al cargar el historial de ventas');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    cargarVentas();
  }, []);

  // FILTROS CON DEBUG DETALLADO
  const ventasFiltradas = useMemo(() => {
    console.log('=== APLICANDO FILTROS ===');
    console.log('Filtro tipo:', filtroTipo);
    console.log('Búsqueda:', busqueda);
    console.log('Date range:', dateRange);
    console.log('Total ventas originales:', ventas.length);
    const mismaFecha = (fecha1, fecha2) => {
      return (
        fecha1.getFullYear() === fecha2.getFullYear() &&
        fecha1.getMonth() === fecha2.getMonth() &&
        fecha1.getDate() === fecha2.getDate()
      );
    };
    const resultado = ventas.filter(venta => {
    // 1. Filtro de búsqueda
    const textoBusqueda = busqueda.toLowerCase().trim();
    const coincideBusqueda = 
      busqueda === '' ||
      venta.id.toString() === busqueda ||
      buscarSoloMedicamentos(venta.productos, textoBusqueda);

    // 2. Filtro por tipo de período
    const ahora = new Date();
    const fechaVenta = new Date(venta.fecha);
    let coincideTipo = true;

    switch (filtroTipo) {
      case 'hoy':
        coincideTipo = fechaVenta.toDateString() === ahora.toDateString();
        break;
      case 'semana':
        const inicioSemana = new Date(ahora);
        inicioSemana.setDate(ahora.getDate() - ahora.getDay());
        inicioSemana.setHours(0,0,0,0);
        coincideTipo = fechaVenta >= inicioSemana;
        break;
      case 'mes':
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        coincideTipo = fechaVenta >= inicioMes;
        break;
      case 'año':
        const inicioAño = new Date(ahora.getFullYear(), 0, 1);
        coincideTipo = fechaVenta >= inicioAño;
        break;
      default:
        coincideTipo = true;
    }

    // 3. Filtro por intervalo personalizado
    let coincideIntervalo = true;
    if (dateRange.start && dateRange.end) {
      const inicio = new Date(dateRange.start);
      const fin = new Date(dateRange.end);
      
      // Rango normal
      coincideIntervalo = fechaVenta >= inicio && fechaVenta <= fin;
      
      // Ajuste si fechas son iguales
      if (mismaFecha(inicio, fin)) {
        coincideIntervalo = mismaFecha(fechaVenta, inicio);
      }
    }

    // Resultado final
    const resultadoFinal = coincideBusqueda && coincideTipo && coincideIntervalo;
    return resultadoFinal;
  });

    console.log('=== RESULTADO FILTRADO ===');
    console.log('Ventas filtradas:', resultado.length);
    console.log('IDs encontrados:', resultado.map(v => v.id));
    
    return resultado;
  }, [ventas, busqueda, filtroTipo, dateRange]);

  return {
    ventas: ventasFiltradas,
    ventasOriginales: ventas,
    error,
    loading,
    busqueda,
    filtroTipo,
    dateRange,
    setBusqueda,
    setFiltroTipo,
    setDateRange
  };
};