//Frontend/FarmaciaOasis/src/ingresos-egresos/hooks/useMovimientos.js
import { useState, useEffect } from 'react';
import IngresosEgresosService from '../services/ingresos-egresosService';

export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarMovimientos = async () => {
    try {
      console.log('Cargando movimientos...');
      setLoading(true);
      setError(null);

      const datos = await IngresosEgresosService.obtenerHistorialCompleto();
      
      // Los datos ya vienen con el tipo desde el backend
      setMovimientos(datos);
      
    } catch (err) {
      console.error(' Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  // Buscar en los movimientos cargados
  const buscarMovimientos = (terminoBusqueda) => {
    if (!terminoBusqueda) return movimientos;
    
    const termino = terminoBusqueda.toLowerCase().trim();
    return movimientos.filter(movimiento =>
      movimiento.nombre.toLowerCase().includes(termino) ||
      movimiento.lote.toLowerCase().includes(termino) ||
      (movimiento.laboratorio && movimiento.laboratorio.toLowerCase().includes(termino))
    );
  };


  return {
    movimientos,
    loading,
    error,
    refetch: cargarMovimientos,
    buscarMovimientos
  };
};