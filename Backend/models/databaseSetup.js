
const db = require("../config/database");

const createTables = () => {
  // LABORATORIO
  db.run(`CREATE TABLE IF NOT EXISTS laboratorio (
    id_lab INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_labo TEXT,
    direccion TEXT
  )`);

  // PROVEEDOR
  db.run(`CREATE TABLE IF NOT EXISTS proveedor (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    telefono TEXT,
    cantidad INTEGER,
    concepto TEXT,
    precio_unitario REAL,
    precio_total REAL
  )`);

  // CLIENTE
  db.run(`CREATE TABLE IF NOT EXISTS cliente (
    cod_cli INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    ci_nit TEXT,
    descuento REAL,
    estado TEXT
  )`);

  // PRODUCTO
  db.run(`CREATE TABLE IF NOT EXISTS producto (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_prod TEXT,
    lote TEXT,
    fecha_exp DATE,
    porcentaje_g REAL,
    stock INTEGER,
    presentacion TEXT,
    precio_venta REAL,
    precio_compra REAL,
    medida TEXT,
    estado TEXT,
    id_lab INTEGER,
    FOREIGN KEY (id_lab) REFERENCES laboratorio(id_lab)
  )`);

  // VENTA
  db.run(`CREATE TABLE IF NOT EXISTS venta (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE DEFAULT (DATE('now','localtime')),
    hora TIME DEFAULT (TIME('now','localtime')),
    total REAL,
    metodo_pago TEXT,
    id_cliente INTEGER,
    descuento REAL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(cod_cli)
  )`);

  // DETALLE_VENTA
  db.run(`CREATE TABLE IF NOT EXISTS detalle_venta (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER,
    id_producto INTEGER,
    cantidad INTEGER,
    subtotal REAL,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
  )`);

  // Historial Ingresos_Egresos
  db.run(`CREATE TABLE IF NOT EXISTS Historial_Ingresos_Egresos (
    id_hie INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER,
    nombre TEXT,
    presentacion TEXT,
    lote TEXT,
    precio_venta REAL,
    stock_antiguo INTEGER,
    stock_nuevo INTEGER,
    fecha DATE DEFAULT (DATE('now','localtime')),
    hora TIME DEFAULT (TIME('now','localtime')),
    laboratorio TEXT
  )`);

  // TRIGGERS
  db.serialize(() => {
    //Eliminar triggers antiguos para evitar duplicados
    db.run(`DROP TRIGGER IF EXISTS registrar_movimiento_venta`);
    db.run(`DROP TRIGGER IF EXISTS registrar_egreso_stock`);
    db.run(`DROP TRIGGER IF EXISTS registrar_ingreso_producto_nuevo`);
    db.run(`DROP TRIGGER IF EXISTS registrar_ingreso_actualizacion_stock`);

    //trigger para registrar movimiento de venta (egreso)
    db.run(`CREATE TRIGGER registrar_movimiento_venta
      AFTER INSERT ON detalle_venta
      FOR EACH ROW
      BEGIN
        INSERT INTO Historial_Ingresos_Egresos (
          id_producto,
          nombre,
          presentacion,
          lote,
          precio_venta,
          stock_antiguo,
          stock_nuevo,
          laboratorio,
          fecha,
          hora
        )
        SELECT
          p.id_producto,
          p.nombre_prod,
          p.presentacion,
          p.lote,
          p.precio_venta,
          p.stock,
          p.stock - NEW.cantidad,
          l.nombre_labo,
          DATE('now','localtime'),
          TIME('now','localtime')
        FROM producto p
        JOIN laboratorio l ON p.id_lab = l.id_lab
        WHERE p.id_producto = NEW.id_producto;

      END;
    `);

    //Trigger pararegistrar ingreso al agregar nuevo producto
    db.run(`CREATE TRIGGER registrar_ingreso_producto_nuevo
      AFTER INSERT ON producto
      FOR EACH ROW
      BEGIN
        INSERT INTO Historial_Ingresos_Egresos (
          id_producto,
          nombre,
          presentacion,
          lote,
          precio_venta,
          stock_antiguo,
          stock_nuevo,
          laboratorio
        )
        SELECT
          NEW.id_producto,
          NEW.nombre_prod,
          NEW.presentacion,
          NEW.lote,
          NEW.precio_venta,
          0,
          NEW.stock,
          l.nombre_labo
        FROM laboratorio l
        WHERE l.id_lab = NEW.id_lab;
      END;
    `);

    // Trigger para registrar ingreso al aumentar stock
    db.run(`CREATE TRIGGER registrar_ingreso_actualizacion_stock
      AFTER UPDATE ON producto
      FOR EACH ROW
      WHEN NEW.stock > OLD.stock
      BEGIN
        INSERT INTO Historial_Ingresos_Egresos (
          id_producto,
          nombre,
          presentacion,
          lote,
          precio_venta,
          stock_antiguo,
          stock_nuevo,
          laboratorio
        )
        SELECT
          NEW.id_producto,
          NEW.nombre_prod,
          NEW.presentacion,
          NEW.lote,
          NEW.precio_venta,
          OLD.stock,
          NEW.stock,
          l.nombre_labo
        FROM laboratorio l
        WHERE l.id_lab = NEW.id_lab;
      END;
    `);
        // Trigger para desactivar producto cuando stock llega a 0
  db.run(`CREATE TRIGGER IF NOT EXISTS desactivar_producto_stock_cero
    AFTER UPDATE ON producto
    FOR EACH ROW
    WHEN NEW.stock = 0 AND OLD.stock > 0 AND NEW.estado = 'activo'
    BEGIN
      UPDATE producto 
      SET estado = 'desactivado' 
      WHERE id_producto = NEW.id_producto;
    END;`);


  });
};
const verificarProductosAlIniciar = () => {
  console.log('🔍 Verificando productos al iniciar servidor...');
  
  // Verificar y desactivar productos con stock 0
  const sqlStockCero = `
    UPDATE producto 
    SET estado = 'desactivado' 
    WHERE stock = 0 AND estado = 'activo'
  `;
  
  db.run(sqlStockCero);
  
  // Verificar y desactivar productos vencidos
  const sqlVencidos = `
    UPDATE producto 
    SET estado = 'desactivado' 
    WHERE fecha_exp IS NOT NULL 
      AND DATE(fecha_exp) < DATE('now','localtime') 
      AND estado = 'activo'
  `;
  
  db.run(sqlVencidos);
  
  // Verificar productos próximos a vencer (opcional, para logging)
  const sqlProximosVencer = `
    SELECT COUNT(*) as count
    FROM producto 
    WHERE fecha_exp IS NOT NULL 
      AND DATE(fecha_exp) BETWEEN DATE('now','localtime') AND DATE('now','localtime','+30 days')
      AND estado = 'activo'
  `;
  
  db.get(sqlProximosVencer);
};

module.exports = { createTables, verificarProductosAlIniciar };