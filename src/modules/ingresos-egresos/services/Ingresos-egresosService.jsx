import { useState } from 'react';
import { useMovimientos } from './hooks/useMovimientos';
import MovimientosList from './components/MovimientosList';
import './ingresos-egresos.css';

function IngresosEgresos() {
  const { movimientos, loading, error } = useMovimientos();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Filtrar movimientos
  const movimientosFiltrados = movimientos.filter(mov => {
    const coincideBusqueda = 
      mov.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      mov.id_producto.toString().includes(busqueda) ||
      mov.lote.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideTipo = 
      filtroTipo === 'todos' ||
      (filtroTipo === 'ingreso' && mov.stock_nuevo > mov.stock_antiguo) ||
      (filtroTipo === 'egreso' && mov.stock_nuevo < mov.stock_antiguo);
    
    return coincideBusqueda && coincideTipo;
  });

  if (loading) {
    return <div className="cargando">Cargando movimientos de productos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ingresos-egresos-container">
      <h1>Ingresos y Egresos de Productos</h1>
      
      {/* Filtros y controles */}
      <div className="controles-container">
        <div className="busqueda-container">
          <input 
            type="text" 
            placeholder="Buscar por producto, ID o lote..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda"
          />
          <button className="btn-buscar">🔍 Buscar</button>
        </div>
        
        <div className="filtros-tipo">
          <label>Filtrar por:</label>
          <select 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos los movimientos</option>
            <option value="ingreso">Solo ingresos</option>
            <option value="egreso">Solo egresos</option>
          </select>
        </div>
      </div>

      {/* Resumen */}
      <div className="resumen-movimientos">
        <div className="resumen-item">
          <span className="resumen-label">Total Movimientos:</span>
          <span className="resumen-valor">{movimientosFiltrados.length}</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-label">Ingresos:</span>
          <span className="resumen-valor positivo">
            {movimientos.filter(m => m.stock_nuevo > m.stock_antiguo).length}
          </span>
        </div>
        <div className="resumen-item">
          <span className="resumen-label">Egresos:</span>
          <span className="resumen-valor negativo">
            {movimientos.filter(m => m.stock_nuevo < m.stock_antiguo).length}
          </span>
        </div>
      </div>

      <MovimientosList movimientos={movimientosFiltrados} />
    </div>
  );
}

export default IngresosEgresos;