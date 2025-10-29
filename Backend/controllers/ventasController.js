const db = require("../config/database");

const ventasController = {
  // Obtener todas las ventas con detalles
  getAllWithDetails: (req, res) => {
    const sql = `
      SELECT 
        v.id_venta,
        v.fecha,
        v.hora,
        c.nombre AS cliente,
        c.ci_nit,
        v.metodo_pago,
        v.total,
        GROUP_CONCAT(p.nombre_prod || ' x' || dv.cantidad, ', ') AS productos
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.cod_cli
      INNER JOIN detalle_venta dv ON dv.id_venta = v.id_venta
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      GROUP BY v.id_venta, v.fecha, v.hora, c.nombre, c.ci_nit, v.metodo_pago, v.total
      ORDER BY v.fecha DESC, v.hora DESC
    `;
    
    db.all(sql, [], (err, rows) => {
      if(err){
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  // Obtener detalles específicos de una venta
  getVentaDetails: (req, res) => {
    const { id } = req.params;
    
    const sqlVenta = `
      SELECT 
        v.*,
        c.nombre as cliente_nombre,
        c.ci_nit as cliente_ci_nit
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.cod_cli
      WHERE v.id_venta = ?
    `;
    
    const sqlDetalles = `
      SELECT 
        dv.*,
        p.nombre_prod,
        p.precio_venta,
        p.presentacion
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `;
    
    db.get(sqlVenta, [id], (err, venta) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      db.all(sqlDetalles, [id], (err, detalles) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        
        res.json({
          data: {
            venta,
            detalles
          }
        });
      });
    });
  },

 
  create: (req, res) => {
    const { cliente, metodo_pago, productos } = req.body;
    
    // Calcular total
    const total = productos.reduce((sum, producto) => {
      return sum + (producto.precio * producto.cantidad);
    }, 0);
    
    // Iniciar transacción
    db.serialize(() => {
      // Insertar venta
      const sqlVenta = `
        INSERT INTO venta (total, metodo_pago, id_cliente)
        VALUES (?, ?, ?)
      `;
      
      db.run(sqlVenta, [total, metodo_pago, cliente || null], function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        
        const ventaId = this.lastID;
        const detalles = [];
        
        // ✅ FUNCIÓN PARA ACTUALIZAR STOCK
        const actualizarStockProducto = (productoId, cantidad, callback) => {
          const sqlActualizarStock = `
            UPDATE producto 
            SET stock = stock - ? 
            WHERE id_producto = ? AND estado = 'activo'
          `;
          
          db.run(sqlActualizarStock, [cantidad, productoId], function(err) {
            if (err) {
              callback(err);
              return;
            }
            
            if (this.changes === 0) {
              callback(new Error(`Producto no encontrado o inactivo: ${productoId}`));
              return;
            }
            
            callback(null);
          });
        };
        
        // Insertar cada detalle de venta y actualizar stock
        let productosProcesados = 0;
        let errorOcurrido = null;
        
        productos.forEach((producto) => {
          const subtotal = producto.precio * producto.cantidad;
          
          // ✅ PRIMERO: Actualizar el stock del producto
          actualizarStockProducto(producto.id, producto.cantidad, (err) => {
            if (err) {
              errorOcurrido = err;
              return;
            }
            
            // ✅ SEGUNDO: Insertar el detalle de venta
            const sqlDetalle = `
              INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal)
              VALUES (?, ?, ?, ?)
            `;
            
            db.run(sqlDetalle, [ventaId, producto.id, producto.cantidad, subtotal], function(err) {
              if (err) {
                errorOcurrido = err;
                return;
              }
              
              detalles.push({
                id_detalle: this.lastID,
                id_producto: producto.id,
                cantidad: producto.cantidad,
                subtotal: subtotal
              });
              
              productosProcesados++;
              
              // Cuando todos los productos han sido procesados
              if (productosProcesados === productos.length) {
                if (errorOcurrido) {
                  res.status(400).json({ error: errorOcurrido.message });
                  return;
                }
                
                res.json({
                  data: {
                    id_venta: ventaId,
                    total,
                    metodo_pago,
                    id_cliente: cliente,
                    detalles
                  }
                });
              }
            });
          });
        });
      });
    });
  },
  // Obtener historial de ingresos/egresos
  getHistorialIngresosEgresos: (req, res) => {
    const sql = `
      SELECT * FROM Historial_Ingresos_Egresos 
      ORDER BY fecha DESC, hora DESC
      LIMIT 100
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  // Obtener ventas por rango de fechas
  getVentasPorFecha: (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    
    const sql = `
      SELECT 
        v.id_venta,
        v.fecha,
        v.hora,
        c.nombre AS cliente,
        v.metodo_pago,
        v.total,
        COUNT(dv.id_detalle) as cantidad_productos
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.cod_cli
      LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
      WHERE v.fecha BETWEEN ? AND ?
      GROUP BY v.id_venta, v.fecha, v.hora, c.nombre, v.metodo_pago, v.total
      ORDER BY v.fecha DESC, v.hora DESC
    `;
    
    db.all(sql, [fechaInicio, fechaFin], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  }
};

module.exports = ventasController;