//src/modules/historial-ventas/hooks/useVentas.js
import { useState, useEffect, useMemo } from 'react'; 
import HistorialVentasService from '../services/historial-ventasService'; 

export function useVentas() {
  const [ventas, setearVentas] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('general');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);

  const buscarSoloMedicamentos = (nombre_prod, textoBusqueda) => {
    if (!nombre_prod) return false;
    
    const textoProductos = nombre_prod.toLowerCase();
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
        console.log('Cargando ventas desde el backend...');

        // Usa la función correcta del servicio
        const datos = await HistorialVentasService.obtenerVentasDetalle();
        console.log('Datos recibidos del backend:', datos);

        // Verifica que datos sea un array
        if (!Array.isArray(datos)) {
          console.error('Los datos recibidos no son un array:', datos);
          setError('Formato de datos incorrecto');
          setearVentas([]);
          return;
        }

        // Ordenar por fecha y hora descendente
        const ventasOrdenadas = datos.sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`);
          const fechaB = new Date(`${b.fecha} ${b.hora}`);
          return fechaB - fechaA;
        });

        console.log('Ventas ordenadas:', ventasOrdenadas);
        setearVentas(ventasOrdenadas);
      } catch (err) {
        console.error('Error completo:', err);
        setError(`Error al cargar el historial de ventas: ${err.message}`);
        setearVentas([]);
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
        (venta.id && venta.id.toString() === busqueda) ||
        (venta.id_venta && venta.id_venta.toString() === busqueda) ||
        buscarSoloMedicamentos(venta.productos, textoBusqueda);

      // 2. Filtro por tipo de período
      const ahora = new Date();
      const fechaVenta = new Date(venta.fecha);
      let coincideTipo = true;

      switch (filtroTipo) {
        case 'hoy':
          coincideTipo = mismaFecha(fechaVenta, ahora);
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
        fin.setHours(23, 59, 59, 999); 
        
        // Rango normal
        coincideIntervalo = fechaVenta >= inicio && fechaVenta <= fin;
      }

      // Resultado final
      const resultadoFinal = coincideBusqueda && coincideTipo && coincideIntervalo;
      return resultadoFinal;
    });

    console.log('=== RESULTADO FILTRADO ===');
    console.log('Ventas filtradas:', resultado.length);
    console.log('IDs encontrados:', resultado.map(v => v.id || v.id_venta));
    
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
}