import { useState, useEffect } from 'react';

function ProductoForm({ producto, laboratorios, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    codigo: '',
    lote: '',
    nombre: '',
    presentacion: '',
    precio_base: '',
    porcentaje_g: '',
    stock: '',
    fecha_expiracion: '',
    laboratorio: ''
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo,
        lote: producto.lote,
        nombre: producto.nombre,
        presentacion: producto.presentacion,
        precio_base: producto.precio_base,
        porcentaje_g: producto.porcentaje_g,
        stock: producto.stock,
        fecha_expiracion: producto.fecha_expiracion,
        laboratorio: producto.laboratorio
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="producto-form">
      <div className="form-grid">
        {/* Fila 1: Código | Lote */}
        <div className="form-group">
          <label htmlFor="codigo">Código</label>
          <input
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Código"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lote">Lote</label>
          <input
            id="lote"
            name="lote"
            value={formData.lote}
            onChange={handleChange}
            placeholder="Lote"
            required
          />
        </div>

        {/* Fila 2: Nombre | Presentación */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="presentacion">Presentación</label>
          <input
            id="presentacion"
            name="presentacion"
            value={formData.presentacion}
            onChange={handleChange}
            placeholder="Presentación"
          />
        </div>

        {/* Fila 3: Precio Base | % Ganancia */}
        <div className="form-group">
          <label htmlFor="precio_base">Precio Base</label>
          <input
            type="number"
            id="precio_base"
            name="precio_base"
            value={formData.precio_base}
            onChange={handleChange}
            placeholder="Precio Base"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="porcentaje_g">Porcentaje Ganancia</label>
          <input
            type="number"
            id="porcentaje_g"
            name="porcentaje_g"
            value={formData.porcentaje_g}
            onChange={handleChange}
            placeholder="Porcentaje Ganancia"
            required
          />
        </div>

        {/* Fila 4: Stock | Fecha Expiración */}
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fecha_expiracion">Fecha Expiración</label>
          <input
            type="date"
            id="fecha_expiracion"
            name="fecha_expiracion"
            value={formData.fecha_expiracion}
            onChange={handleChange}
            required
          />
        </div>

        {/* Fila 5: Laboratorio (ocupa 2 columnas) */}
        <div className="form-group full-width">
          <label htmlFor="laboratorio">Seleccionar laboratorio</label>
          <select
            id="laboratorio"
            name="laboratorio"
            value={formData.laboratorio}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar laboratorio</option>
            {laboratorios.map(lab => (
              <option key={lab.id} value={lab.nombre}>
                {lab.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button type="submit" className="btn-agregar">
          {producto ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
        <button type="button" onClick={onCancel} className="btn-cancelar">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;