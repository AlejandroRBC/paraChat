import { Button, NumberInput, Text, Group } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconCalculator } from '@tabler/icons-react';

function ProductoForm({ producto, laboratorios, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    codigo: '',
    lote: '',
    nombre: '',
    presentacion: '',
    precio_compra: '',
    porcentaje_g: '',
    stock: '',
    fecha_expiracion: '',
    laboratorio: ''
  });

  const [precioVentaCalculado, setPrecioVentaCalculado] = useState(0);

  // Calcular precio de venta cuando cambien precio_compra o porcentaje_g
  useEffect(() => {
    calcularPrecioVenta();
  }, [formData.precio_compra, formData.porcentaje_g]);

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo || '',
        lote: producto.lote || '',
        nombre: producto.nombre || '',
        presentacion: producto.presentacion || '',
        precio_compra: producto.precio_base || '',
        porcentaje_g: producto.porcentaje_g || '',
        stock: producto.stock || '',
        fecha_expiracion: producto.fecha_expiracion || '',
        laboratorio: producto.laboratorio || ''
      });
    }
  }, [producto]);

  const calcularPrecioVenta = () => {
    const precioCompra = parseFloat(formData.precio_compra) || 0;
    const porcentajeGanancia = parseFloat(formData.porcentaje_g) || 0;
    
    if (precioCompra > 0 && porcentajeGanancia > 0) {
      const ganancia = precioCompra * (porcentajeGanancia / 100);
      const precioVenta = precioCompra + ganancia;
      setPrecioVentaCalculado(precioVenta);
    } else {
      setPrecioVentaCalculado(0);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Incluir el precio de venta calculado en los datos a enviar
    const datosCompletos = {
      ...formData,
      precio_venta: precioVentaCalculado
    };
    
    onSubmit(datosCompletos);
  };

  return (
    <form onSubmit={handleSubmit} className="mantine-form">
      <div className="mantine-form-grid">
        
        
        <div className="mantine-form-group">
          <label htmlFor="lote">Lote</label>
          <input
            id="lote"
            name="lote"
            value={formData.lote}
            onChange={(e) => handleChange('lote', e.target.value)}
            placeholder="Lote"
            required
          />
        </div>

        {/* Fila 2: Nombre | Presentación */}
        <div className="mantine-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Nombre"
            required
          />
        </div>
        
        <div className="mantine-form-group">
          <label htmlFor="presentacion">Presentación</label>
          <input
            id="presentacion"
            name="presentacion"
            value={formData.presentacion}
            onChange={(e) => handleChange('presentacion', e.target.value)}
            placeholder="Presentación"
          />
        </div>

        {/* Fila 3: Precio Compra | % Ganancia */}
        <div className="mantine-form-group">
          <label htmlFor="precio_compra">Precio de Compra (Bs)</label>
          <NumberInput
            id="precio_compra"
            name="precio_compra"
            value={formData.precio_compra}
            onChange={(value) => handleChange('precio_compra', value)}
            placeholder="0.00"
            min={0}
            step={0.01}
            precision={2}
            required
          />
        </div>
        
        <div className="mantine-form-group">
          <label htmlFor="porcentaje_g">Porcentaje Ganancia (%)</label>
          <NumberInput
            id="porcentaje_g"
            name="porcentaje_g"
            value={formData.porcentaje_g}
            onChange={(value) => handleChange('porcentaje_g', value)}
            placeholder="0"
            min={0}
            max={1000}
            step={1}
            required
          />
        </div>

        {/* Fila 4: Precio de Venta Calculado */}
        <div className="mantine-form-group full-width">
          <label htmlFor="precio_venta">
            <Group gap="xs">
              <IconCalculator size={16} />
              Precio de Venta Calculado
            </Group>
          </label>
          <div
            style={{
              padding: '12px 16px',
              border: '2px solid #e1f5fe',
              borderRadius: '8px',
              backgroundColor: '#f8fdff',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#1871c1',
              textAlign: 'center'
            }}
          >
            Bs {precioVentaCalculado.toFixed(2)}
          </div>
          <Text size="sm" c="dimmed" mt="xs">
            Precio de Compra: Bs {(parseFloat(formData.precio_compra) || 0).toFixed(2)} + 
            {formData.porcentaje_g || 0}% = Bs {precioVentaCalculado.toFixed(2)}
          </Text>
        </div>

        {/* Fila 5: Stock | Fecha Expiración */}
        <div className="mantine-form-group">
          <label htmlFor="stock">Stock</label>
          <NumberInput
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={(value) => handleChange('stock', value)}
            placeholder="0"
            min={0}
            required
          />
        </div>
        
        <div className="mantine-form-group">
          <label htmlFor="fecha_expiracion">Fecha Expiración</label>
          <input
            type="date"
            id="fecha_expiracion"
            name="fecha_expiracion"
            value={formData.fecha_expiracion}
            onChange={(e) => handleChange('fecha_expiracion', e.target.value)}
            required
          />
        </div>

        {/* Fila 6: Laboratorio (ocupa 2 columnas) */}
        <div className="mantine-form-group full-width">
          <label htmlFor="laboratorio">Seleccionar laboratorio</label>
          <select
            id="laboratorio"
            name="laboratorio"
            value={formData.laboratorio}
            onChange={(e) => handleChange('laboratorio', e.target.value)}
            required
          >
            <option value="">Seleccionar laboratorio</option>
            {laboratorios.map(lab => (
              <option key={lab.id_lab || lab.id} value={lab.nombre_labo || lab.nombre}>
                {lab.nombre_labo || lab.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="mantine-form-actions">
        <Button type="submit" className="btn-agregar" disabled={precioVentaCalculado <= 0}>
          {producto ? 'Guardar Cambios' : 'Agregar Producto'}
        </Button>
        <Button type="button" onClick={onCancel} className="btn-cancelar">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default ProductoForm;