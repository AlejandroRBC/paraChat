import { useState } from 'react';
import Carrito from './Carrito';

function VentaForm({ 
  carrito, 
  totalVenta, 
  onModificarCantidad, 
  onEliminarItem, 
  onVaciarCarrito, 
  onRealizarVenta, 
  onCancel 
}) {
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    ci_nit: '',
    metodo_pago: ''
  });

  const handleChange = (e) => {
    setDatosCliente({
      ...datosCliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    if (!datosCliente.nombre || !datosCliente.metodo_pago) {
      alert('Complete los datos del cliente');
      return;
    }
    onRealizarVenta(datosCliente);
  };

  return (
    <div className="venta-form">
      <h2>Finalizar Venta</h2>
      
      <Carrito
        carrito={carrito}
        onModificarCantidad={onModificarCantidad}
        onEliminarItem={onEliminarItem}
        totalVenta={totalVenta}
      />

      <form onSubmit={handleSubmit} className="datos-cliente">
        <h3>Datos del Cliente</h3>
        
        <input
          name="nombre"
          value={datosCliente.nombre}
          onChange={handleChange}
          placeholder="Nombre Cliente"
          required
        />
        
        <input
          name="ci_nit"
          value={datosCliente.ci_nit}
          onChange={handleChange}
          placeholder="CI / NIT"
        />
        
        <select
          name="metodo_pago"
          value={datosCliente.metodo_pago}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar método de pago</option>
          <option value="efectivo">Efectivo</option>
          <option value="qr">QR</option>
          <option value="mixto">Mixto</option>
        </select>

        <div className="acciones-venta">
          <button type="submit" className="btn-primario">
            ✅ Generar Venta
          </button>
          <button 
            type="button" 
            onClick={onVaciarCarrito}
            className="btn-secundario"
          >
            🗑️ Borrar Todo
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secundario"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default VentaForm;