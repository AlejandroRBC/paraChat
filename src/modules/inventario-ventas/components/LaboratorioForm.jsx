import { Button } from '@mantine/core';
import { useState } from 'react';


function LaboratorioForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nombre: '', direccion: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mantine-form">
      {/* Usamos el mismo grid que en ProductoForm */}
      <div className="mantine-form-grid">
        <div className="mantine-form-group">
          <label htmlFor="nombre">Nombre del laboratorio</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre del laboratorio"
            required
          />
        </div>

        <div className="mantine-form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ingrese la dirección del laboratorio"
            required
          />
        </div>
      </div>

      <div className="mantine-form-actions">
        <Button type="submit" className="btn-agregar">
          Agregar Laboratorio
        </Button>
        <Button type="button" onClick={onCancel} className="btn-cancelar">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default LaboratorioForm;
