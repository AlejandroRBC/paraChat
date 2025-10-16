import { useState } from 'react';
import { useVentas } from './hooks/useVentas';
import VentasList from './components/VentasList';
import { Buscador } from '../global/components/buscador/buscador';
import { Select as MantineSelect, Button, Modal, Group, Stack, Text } from '@mantine/core';
import { IconCalendar, IconDownload } from '@tabler/icons-react';
import { IconCurrencyDollar } from '@tabler/icons-react';
import './historial-ventas.css';

function HistorialVentas() {
  const { 
    ventas, 
    ventasOriginales, 
    loading, 
    error, 
    busqueda,
    filtroTipo,
    dateRange,
    setBusqueda, 
    setFiltroTipo, 
    setDateRange 
  } = useVentas();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBusquedaChange = (valor) => {
    setBusqueda(valor);
  };

  const handleFiltroChange = (value) => {
    setFiltroTipo(value);
  };

  const handleGenerarReporte = () => {
    const data = {
      tipo: filtroTipo,
      fechaInicio: dateRange.start,
      fechaFin: dateRange.end,
      totalVentas: ventas.length,
      ventas: ventas
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-ventas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleAplicarIntervalo = (fechaInicio, fechaFin) => {
    setDateRange({ start: fechaInicio, end: fechaFin });
    setIsModalOpen(false);
  };

  const handleLimpiarIntervalo = () => {
    setDateRange({ start: null, end: null });
  };

  const opcionesReporte = [
    { value: 'general', label: 'General' },
    { value: 'semana', label: 'Semana Actual' },
    { value: 'mes', label: 'Mes Actual' },
    { value: 'año', label: 'Año Actual' },
  ];

  if (loading) {
    return <div className="cargando">Cargando historial de ventas...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="historial-ventas-container">
      <h1>
        <div className="historial-icon-container">
          <IconCurrencyDollar size={32} /> {/* Ajusta el tamaño según necesites */}
        </div>
        Historial de Ventas
      
      </h1>
      
      <div className="historial-controles-container">
        <div className="historial-busqueda-container">
          <Buscador
            placeholder="Buscar por ID de venta y nombre producto"
            value={busqueda}
            onChange={handleBusquedaChange}
            style={{ width: '600px' }}
          />
        </div>
        
        <div className="historial-filtros-container">
          <Group gap="md">
            <MantineSelect
              label="Periodo del Reporte"
              value={filtroTipo}
              onChange={handleFiltroChange}
              data={opcionesReporte}
              size="sm"
              style={{ minWidth: '250px' }}
              placeholder="Seleccionar período"
            />
            
            <Button
              variant={dateRange.start ? "filled" : "outline"}
              leftSection={<IconCalendar size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Intervalo {dateRange.start && '✓'}
            </Button>

            {dateRange.start && (
              <Button
                variant="subtle"
                color="red"
                onClick={handleLimpiarIntervalo}
              >
                Limpiar
              </Button>
            )}

            <Button
              variant="filled"
              leftSection={<IconDownload size={16} />}
              onClick={handleGenerarReporte}
              disabled={ventas.length === 0}
            >
              Generar Reporte Excel 
            </Button>
          </Group>
        </div>
      </div>

      <VentasList ventas={ventas} />

      <Modal
        title="Seleccionar Intervalo de Fechas"
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        classNames={{
          content: 'mantine-modal-content',
          header: 'mantine-modal-header',
          title: 'mantine-modal-title',
        }}
      >
        <DateRangeModal 
          onApply={handleAplicarIntervalo}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

function DateRangeModal({ onApply, onCancel }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
    }
  };

  const isDateValid = startDate && endDate && new Date(startDate) <= new Date(endDate);

  return (
    <Stack gap="md">
      <div className="historial-date-inputs">
        <div className="historial-date-field">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-picker"
            max={endDate || undefined}
          />
        </div>
        <div className="historial-date-field">
          <label>Fecha Fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-picker"
            min={startDate || undefined}
          />
        </div>
      </div>
      
      {startDate && endDate && new Date(startDate) > new Date(endDate) && (
        <Text size="sm" c="red">
          La fecha de inicio no puede ser mayor a la fecha fin
        </Text>
      )}
      
      <Group justify="flex-end" gap="sm">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleApply}
          disabled={!isDateValid}
        >
          Aplicar
        </Button>
      </Group>
    </Stack>
  );
}

export default HistorialVentas;