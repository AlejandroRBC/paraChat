function MovimientosList({ movimientos }) {
    const calcularMovimiento = (stockAntiguo, stockNuevo) => {
      return stockNuevo - stockAntiguo;
    };
  
    const getTipoMovimiento = (stockAntiguo, stockNuevo) => {
      const movimiento = stockNuevo - stockAntiguo;
      if (movimiento > 0) return 'ingreso';
      if (movimiento < 0) return 'egreso';
      return 'sin-cambio';
    };
  
    const getColorMovimiento = (tipo) => {
      const colores = {
        'ingreso': '#28a745',
        'egreso': '#dc3545',
        'sin-cambio': '#6c757d'
      };
      return colores[tipo];
    };
  
    if (movimientos.length === 0) {
      return (
        <div className="sin-movimientos">
          <p>No hay movimientos registrados.</p>
        </div>
      );
    }
  
    return (
      <div className="containerTabla">
        <table>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Nombre</th>
              <th>Complemento</th>
              <th>Lote</th>
              <th>Precio Venta</th>
              <th>Stock Antiguo</th>
              <th>Stock Nuevo</th>
              <th>Movimiento</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Laboratorio</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((movimiento) => {
              const tipo = getTipoMovimiento(movimiento.stock_antiguo, movimiento.stock_nuevo);
              const cantidadMovimiento = calcularMovimiento(movimiento.stock_antiguo, movimiento.stock_nuevo);
              
              return (
                <tr key={movimiento.id} className={`fila-movimiento ${tipo}`}>
                  <td className="id-producto">#{movimiento.id_producto}</td>
                  <td className="nombre-producto">{movimiento.nombre}</td>
                  <td className="complemento">{movimiento.complemento}</td>
                  <td className="lote">{movimiento.lote}</td>
                  <td className="precio">{movimiento.precio_venta.toFixed(2)} Bs</td>
                  <td className="stock-antiguo">{movimiento.stock_antiguo}</td>
                  <td className="stock-nuevo">{movimiento.stock_nuevo}</td>
                  <td className="movimiento">
                    <span 
                      className="badge-movimiento"
                      style={{ backgroundColor: getColorMovimiento(tipo) }}
                    >
                      {tipo === 'ingreso' ? '↑' : tipo === 'egreso' ? '↓' : '='} 
                      {Math.abs(cantidadMovimiento)}
                    </span>
                  </td>
                  <td className="fecha">
                    {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="hora">{movimiento.hora}</td>
                  <td className="laboratorio">{movimiento.laboratorio}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default MovimientosList;