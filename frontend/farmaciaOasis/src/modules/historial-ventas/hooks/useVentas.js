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

  const obtenerLunesSemanaActual = (fecha) => {
    const fechaCopy = new Date(fecha);
    const dia = fechaCopy.getDay();
    const diff = fechaCopy.getDate() - dia + (dia === 0 ? -6 : 1);
    return new Date(fechaCopy.setDate(diff));
  };

  const obtenerDomingoSemanaActual = (fecha) => {
    const lunes = obtenerLunesSemanaActual(fecha);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    return domingo;
  };

  const parsearFecha = (fechaString) => {
    if (!fechaString) return null;
    
    try {
      if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [año, mes, dia] = fechaString.split('-').map(Number);
        return new Date(año, mes - 1, dia, 12, 0, 0, 0);
      }
      
      if (fechaString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [dia, mes, año] = fechaString.split('/').map(Number);
        return new Date(año, mes - 1, dia, 12, 0, 0, 0);
      }
      
      const fecha = new Date(fechaString);
      return isNaN(fecha.getTime()) ? null : fecha;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setLoading(true);
        setError(null);

        const datos = await HistorialVentasService.obtenerVentasDetalle();

        if (!Array.isArray(datos)) {
          setError('Formato de datos incorrecto');
          setearVentas([]);
          return;
        }

        const ventasOrdenadas = datos.sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`);
          const fechaB = new Date(`${b.fecha} ${b.hora}`);
          return fechaB - fechaA;
        });

        setearVentas(ventasOrdenadas);
      } catch (err) {
        setError(`Error al cargar el historial de ventas: ${err.message}`);
        setearVentas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarVentas();
  }, []);

  const ventasFiltradas = useMemo(() => {
    let resultado = [...ventas];

    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase().trim();
      resultado = resultado.filter(venta =>
        busqueda === '' ||
        (venta.id && venta.id.toString() === busqueda) ||
        (venta.id_venta && venta.id_venta.toString() === busqueda) ||
        buscarSoloMedicamentos(venta.productos, textoBusqueda)
      );
    }

    if (filtroTipo !== 'general') {
      const ahora = new Date();
      
      switch (filtroTipo) {
        case 'hoy':
          resultado = resultado.filter(venta => {
            const fechaVenta = parsearFecha(venta.fecha);
            const hoy = new Date();
            return fechaVenta && 
              fechaVenta.getDate() === hoy.getDate() &&
              fechaVenta.getMonth() === hoy.getMonth() &&
              fechaVenta.getFullYear() === hoy.getFullYear();
          });
          break;
        
        case 'semana':
          { const lunesSemana = obtenerLunesSemanaActual(ahora);
          lunesSemana.setHours(0, 0, 0, 0);
          
          const domingoSemana = obtenerDomingoSemanaActual(ahora);
          domingoSemana.setHours(23, 59, 59, 999);
          
          resultado = resultado.filter(venta => {
            const fechaVenta = parsearFecha(venta.fecha);
            return fechaVenta && fechaVenta >= lunesSemana && fechaVenta <= domingoSemana;
          });
          break; }
        
        case 'mes':
          { const añoActual = ahora.getFullYear();
          const mesActual = ahora.getMonth();
          
          resultado = resultado.filter(venta => {
            if (!venta.fecha) return false;
            
            const match = venta.fecha.match(/^(\d{4})-(\d{2})-/);
            if (!match) return false;
            
            const añoVenta = parseInt(match[1]);
            const mesVenta = parseInt(match[2]) - 1;
            
            return añoVenta === añoActual && mesVenta === mesActual;
          });
          break; }
        
        case 'año':
          { const año = ahora.getFullYear();
          resultado = resultado.filter(venta => {
            if (!venta.fecha) return false;
            
            const match = venta.fecha.match(/^(\d{4})-/);
            if (!match) return false;
            
            const añoVenta = parseInt(match[1]);
            return añoVenta === año;
          });
          break; }
        
        default:
          break;
      }
    }

    if (dateRange.start && dateRange.end) {
      const inicio = new Date(dateRange.start);
      inicio.setHours(0, 0, 0, 0);
      
      const fin = new Date(dateRange.end);
      fin.setHours(23, 59, 59, 999);
      
      resultado = resultado.filter(venta => {
        const fechaVenta = parsearFecha(venta.fecha);
        return fechaVenta && fechaVenta >= inicio && fechaVenta <= fin;
      });
    }

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