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
    <form onSubmit={handleSubmit} className="laboratorio-form">
      <div className="form-group">
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

      <div className="form-group">
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

      <div className="form-actions">
        <button type="submit" className="btn-agregar">
          Agregar Laboratorio
        </button>
        <button type="button" onClick={onCancel} className="btn-cancelar">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default LaboratorioForm;