import { useState } from 'react';
import { 
  Paper, 
  Text, 
  Grid, 
  Group,
  LoadingOverlay,
  Alert,
  Title,
  Box,
  Badge,
  ActionIcon,
  Tooltip,
  Button,
  Stack
} from '@mantine/core';
import { DatesProvider, DateInput } from '@mantine/dates';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconArrowsExchange,
  IconFilter,
  IconRefresh,
  IconX,
  IconId,
  IconCalendar,
  IconChartBar,
  IconDownload,
  IconSearch
} from '@tabler/icons-react';
import { useMovimientos } from './hooks/useMovimientos';
import MovimientosList from './components/MovimientosList';
import { Select } from '../global/components/Select/Select';
import { Buscador } from '../global/components/buscador/Buscador';
import './ingresos-egresos.css';

function IngresosEgresos() {
  const { movimientos, loading, error, refetch, buscarMovimientos } = useMovimientos();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [filtroRapido, setFiltroRapido] = useState('general');

  // Opciones para el select de filtro
  const opcionesFiltro = [
    { value: 'todos', label: 'Todos los movimientos' },
    { value: 'ingreso', label: 'Solo ingresos' },
    { value: 'egreso', label: 'Solo egresos' },
  ];

  // Opciones para filtros rápidos de fecha
  const opcionesFiltroRapido = [
    { value: 'general', label: 'General' },
    { value: 'hoy', label: 'Hoy' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'mes', label: 'Este mes' },
    { value: 'año', label: 'Este año' },
    { value: 'intervalo', label: 'Intervalo personalizado' },
  ];

  // Función para aplicar filtros rápidos de fecha
  const aplicarFiltroRapido = (filtro) => {
    const hoy = new Date();
    setFiltroRapido(filtro);
    
    switch (filtro) {
      case 'hoy':
        setFechaInicio(hoy);
        setFechaFin(hoy);
        break;
      case 'semana':
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        setFechaInicio(inicioSemana);
        setFechaFin(hoy);
        break;
      case 'mes':
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        setFechaInicio(inicioMes);
        setFechaFin(hoy);
        break;
      case 'año':
        const inicioAño = new Date(hoy.getFullYear(), 0, 1);
        setFechaInicio(inicioAño);
        setFechaFin(hoy);
        break;
      case 'general':
        setFechaInicio(null);
        setFechaFin(null);
        break;
      default:
        break;
    }
  };

  // Función para filtrar por fecha
  const filtrarPorFecha = (movimiento) => {
    if (!fechaInicio && !fechaFin) return true;
    
    const fechaMovimiento = new Date(movimiento.fecha);
    
    if (fechaInicio && fechaFin) {
      return fechaMovimiento >= fechaInicio && fechaMovimiento <= fechaFin;
    } else if (fechaInicio) {
      return fechaMovimiento >= fechaInicio;
    } else if (fechaFin) {
      return fechaMovimiento <= fechaFin;
    }
    
    return true;
  };

  // Filtrar movimientos - AHORA USA LA NUEVA FUNCIÓN DE BÚSQUEDA
  const movimientosFiltrados = buscarMovimientos(busqueda)
    .filter(mov => {
      const coincideTipo = 
        filtroTipo === 'todos' ||
        (filtroTipo === 'ingreso' && mov.stock_nuevo > mov.stock_antiguo) ||
        (filtroTipo === 'egreso' && mov.stock_nuevo < mov.stock_antiguo);
      
      return coincideTipo;
    })
    .filter(filtrarPorFecha);

  // Estadísticas
  const totalIngresos = movimientosFiltrados.filter(m => m.stock_nuevo > m.stock_antiguo).length;
  const totalEgresos = movimientosFiltrados.filter(m => m.stock_nuevo < m.stock_antiguo).length;
  const totalMovimientos = movimientosFiltrados.length;

  // Función para generar reporte Excel
  const generarReporteExcel = () => {
    alert(`Reporte Excel generado con ${movimientosFiltrados.length} movimientos`);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroTipo('todos');
    setBusqueda('');
    setFechaInicio(null);
    setFechaFin(null);
    setFiltroRapido('general');
  };

  if (loading) {
    return (
      <Box style={{ position: 'relative', height: 400 }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert color="red" title="Error" variant="filled">
        {error}
      </Alert>
    );
  }

  return (
    <DatesProvider settings={{ locale: 'es', firstDayOfWeek: 0, weekendDays: [0, 6] }}>
      <Box className="ingresos-egresos-container">
        {/* Header con título y controles */}
        <Group justify="space-between" mb="xl">
          <Group>
            <div className="title-icon">
              <IconChartBar size={24} />
            </div>
            <Title order={1} className="gradient-title">
              Ingresos y Egresos de Productos
            </Title>
          </Group>
          <Group>
            <Button
              leftSection={<IconDownload size={18} />}
              className="excel-button"
              onClick={generarReporteExcel}
              disabled={movimientosFiltrados.length === 0}
            >
              Generar Reporte Excel
            </Button>
            <Tooltip label="Actualizar datos">
              <ActionIcon
                variant="gradient"
                size="lg"
                onClick={refetch}
                loading={loading}
              >
                <IconRefresh size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {/* Controles de Filtrado */}
        <Paper p="lg" withBorder radius="lg" shadow="sm" mb="xl">
          <Stack gap="md">
            {/* Primera fila: Búsqueda más larga y filtros a la derecha */}
            <Group justify="space-between" align="flex-end">
              {/* Buscador más largo */}
              <Box className="buscador-largo">
                <Buscador
                  placeholder="Buscar por ID, nombre del producto o lote..."
                  value={busqueda}
                  onChange={setBusqueda}
                  withSearchButton={false}
                  size="md"
                  icon={<IconSearch size={18} />}
                />
              </Box>

              {/* Filtros a la derecha */}
              <Group className="filtros-derecho">
                {/* Filtro por tipo centrado */}
                <Box className="filtro-tipo-centrado">
                  <Select
                    label="Filtrar por tipo"
                    placeholder="Tipo de movimiento"
                    data={opcionesFiltro}
                    value={filtroTipo}
                    onChange={setFiltroTipo}
                    clearable={false}
                    icon={<IconFilter size={16} />}
                  />
                </Box>

                {/* Filtro rápido de fechas */}
                <Box style={{ minWidth: 220 }}>
                  <Select
                    label="Período de tiempo"
                    placeholder="Seleccionar período"
                    data={opcionesFiltroRapido}
                    value={filtroRapido}
                    onChange={aplicarFiltroRapido}
                    clearable={false}
                    icon={<IconCalendar size={16} />}
                  />
                </Box>

                {/* Contador y acciones */}
                <Group gap="xs" align="flex-end">
                  <Text size="sm" c="dimmed">
                    {movimientosFiltrados.length} de {movimientos.length}
                  </Text>
                  {(busqueda || filtroTipo !== 'todos' || fechaInicio || fechaFin) && (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={limpiarFiltros}
                      title="Limpiar filtros"
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Group>
            </Group>

            {/* Segunda fila: Selector de intervalo personalizado */}
            {filtroRapido === 'intervalo' && (
              <Group justify="flex-end" align="flex-end" gap="md">
                <DateInput
                  label="Fecha inicio"
                  value={fechaInicio}
                  onChange={setFechaInicio}
                  maxDate={fechaFin || new Date()}
                  clearable
                  valueFormat="DD/MM/YYYY"
                  placeholder="Selecciona fecha inicio"
                  style={{ minWidth: 180 }}
                />
                <DateInput
                  label="Fecha fin"
                  value={fechaFin}
                  onChange={setFechaFin}
                  minDate={fechaInicio}
                  maxDate={new Date()}
                  clearable
                  valueFormat="DD/MM/YYYY"
                  placeholder="Selecciona fecha fin"
                  style={{ minWidth: 180 }}
                />
              </Group>
            )}

            {/* Estado de filtros activos */}
            {(busqueda || filtroTipo !== 'todos' || fechaInicio || fechaFin) && (
              <Group justify="flex-end" gap="xs">
                <Text size="sm" fw={500}>Filtros activos:</Text>
                {busqueda && (
                  <Badge color="blue" variant="light" size="sm">
                    <Group gap={4}>
                      <IconSearch size={12} />
                      Búsqueda: "{busqueda}"
                    </Group>
                  </Badge>
                )}
                {filtroTipo !== 'todos' && (
                  <Badge 
                    color={filtroTipo === 'ingreso' ? 'green' : 'red'} 
                    variant="light" 
                    size="sm"
                  >
                    {filtroTipo === 'ingreso' ? 'Solo Ingresos' : 'Solo Egresos'}
                  </Badge>
                )}
                {fechaInicio && fechaFin && (
                  <Badge color="orange" variant="light" size="sm">
                    <Group gap={4}>
                      <IconCalendar size={12} />
                      {fechaInicio.toLocaleDateString('es-ES')} - {fechaFin.toLocaleDateString('es-ES')}
                    </Group>
                  </Badge>
                )}
                {fechaInicio && !fechaFin && (
                  <Badge color="orange" variant="light" size="sm">
                    <Group gap={4}>
                      <IconCalendar size={12} />
                      Desde: {fechaInicio.toLocaleDateString('es-ES')}
                    </Group>
                  </Badge>
                )}
                {!fechaInicio && fechaFin && (
                  <Badge color="orange" variant="light" size="sm">
                    <Group gap={4}>
                      <IconCalendar size={12} />
                      Hasta: {fechaFin.toLocaleDateString('es-ES')}
                    </Group>
                  </Badge>
                )}
              </Group>
            )}
          </Stack>
        </Paper>

        {/* Resumen de Movimientos */}
        <Grid gutter="md" mb="xl">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper p="md" withBorder radius="lg" shadow="sm" className="stat-card">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed">Total Movimientos</Text>
                  <Text size="xl" className="number-total">{totalMovimientos}</Text>
                </div>
                <div className="stat-icon-total">
                  <IconArrowsExchange size={24} />
                </div>
              </Group>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper p="md" withBorder radius="lg" shadow="sm" className="stat-card">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed">Ingresos</Text>
                  <Text size="xl" className="number-ingreso">{totalIngresos}</Text>
                </div>
                <div className="stat-icon-ingreso">
                  <IconTrendingUp size={24} />
                </div>
              </Group>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper p="md" withBorder radius="lg" shadow="sm" className="stat-card">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed">Egresos</Text>
                  <Text size="xl" className="number-egreso">{totalEgresos}</Text>
                </div>
                <div className="stat-icon-egreso">
                  <IconTrendingDown size={24} />
                </div>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper p="md" withBorder radius="lg" shadow="sm" className="stat-card">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed">Saldo Neto</Text>
                  <Text size="xl" className="number-saldo">
                    {totalIngresos - totalEgresos >= 0 ? '+' : ''}{totalIngresos - totalEgresos}
                  </Text>
                </div>
                <div className="stat-icon-saldo">
                  <IconArrowsExchange size={24} />
                </div>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Lista de Movimientos */}
        <MovimientosList movimientos={movimientosFiltrados} />
      </Box>
    </DatesProvider>
  );
}

export default IngresosEgresos;