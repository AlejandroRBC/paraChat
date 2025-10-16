import { 
  Container, 
  Title, 
  Button, 
  Group, 
  Paper,
  Grid,
  Card,
  ActionIcon,
  Text,
  Divider,
  Box
} from '@mantine/core';
import { IconPlus, IconX, IconTruck, IconTrash } from '@tabler/icons-react';
import { useProveedores } from './hooks/useProveedores';
import { ProveedorList } from './components/ProveedorList';
import { ProveedorForm } from './components/ProveedorForm';
import { Buscador } from '../global/components/buscador/buscador';
import { useMediaQuery } from 'react-responsive';
import Modal from '../global/components/Modal/Modal';
import './proveedor.css';

export function ProveedorPage() {
  const {
    proveedores,
    proveedoresOriginales,
    proveedorEditando,
    mostrarForm,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    proveedorAEliminar,
    mostrarConfirmacion,
    setProveedorEditando,
    setMostrarForm,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    solicitarEliminacion,
    cancelarEliminacion,
    manejarSeleccionResultado,
  } = useProveedores();

  // Breakpoints responsive
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  const handleGuardarProveedor = (datosProveedor) => {
    if (proveedorEditando) {
      actualizarProveedor({ ...datosProveedor, id: proveedorEditando.id });
    } else {
      crearProveedor(datosProveedor);
    }
    cerrarFormulario();
  };

  const abrirNuevoProveedor = () => {
    setProveedorEditando(null);
    setMostrarForm(true);
  };

  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarForm(true);
  };

  const cerrarFormulario = () => {
    setMostrarForm(false);
    setProveedorEditando(null);
  };

  // Calcular spans responsive
  const getGridSpans = () => {
    if (isMobile) {
      return mostrarForm ? { lista: 12, form: 12 } : { lista: 12, form: 12 };
    }
    if (isTablet) {
      return mostrarForm ? { lista: 7, form: 5 } : { lista: 12, form: 0 };
    }
    return mostrarForm ? { lista: 8, form: 4 } : { lista: 12, form: 0 };
  };

  const gridSpans = getGridSpans();

  const renderizarResultado = (resultado) => (
    <Group justify="space-between" w="100%">
      <div>
        <Text size="sm" fw={500}>
          {resultado.label}
        </Text>
        
      </div>
      <Text size="xs" c="blue" className="result-category">
        {resultado.category}
      </Text>
    </Group>
  );

  return (
    <div className="proveedor-page">
      <Container size="xl" py="xl" px={isMobile ? "xs" : "md"}>
        {/* Header Responsive */}
        <Group justify="space-between" mb="xl" wrap={isMobile ? "wrap" : "nowrap"} gap={isMobile ? "md" : "lg"}>
          <Group gap="md" wrap="nowrap">
            <div className="header-icon">
              <IconTruck size={isMobile ? 24 : 32} />
            </div>
            <div>
              <Title 
                order={isMobile ? 2 : 1} 
                className="gradient-title"
                style={{ fontSize: isMobile ? '28px' : '32px' }}
              >
                Gestión de Proveedores
              </Title>
              <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                Administra tu lista de proveedores
              </Text>
            </div>
          </Group>
          
          {!mostrarForm && (
            <Button 
              leftSection={<IconPlus size={isMobile ? 14 : 18} />}
              onClick={abrirNuevoProveedor}
              size={isMobile ? "sm" : "md"}
              fullWidth={isMobile}
            >
              Nuevo Proveedor
            </Button>
          )}
        </Group>

        <Grid gutter={isMobile ? "md" : "xl"} align="start">
          {/* Lista de proveedores */}
          <Grid.Col span={gridSpans.lista}>
            <Paper withBorder p={isMobile ? "sm" : "md"} radius="md" className="list-container">
              <div className="card-header">
                <Group 
                  justify="space-between" 
                  align={isMobile ? "flex-start" : "flex-end"} 
                  mb="md"
                  wrap={isMobile ? "wrap" : "nowrap"}
                  gap={isMobile ? "sm" : "md"}
                >
                  <div>
                    <Title order={isMobile ? 3 : 2} className="gradient-title">
                      Lista de Proveedores
                    </Title>
                    <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                      {proveedores.length} de {proveedoresOriginales.length} proveedores activos
                      {busqueda && ` - Buscando: "${busqueda}"`}
                    </Text>
                  </div>
                </Group>
                
                {/* BUSCADOR RESPONSIVE */}
                <Box className="buscador-container">
                  <Buscador
                    placeholder="Buscar proveedores..."
                    value={busqueda}
                    onChange={setBusqueda}
                    onSearch={(valor) => console.log('Buscando:', valor)}
                    onClear={() => setBusqueda('')}
                    onResultSelect={manejarSeleccionResultado}
                    results={resultadosBusqueda}
                    renderResult={renderizarResultado}
                    width="100%"
                    maxWidth={isMobile ? "100%" : "500px"}
                    withShortcut={!isMobile}
                    withSearchButton={false}
                    autoFocus={false}
                    size={isMobile ? "sm" : "md"}
                  />
                </Box>
              </div>
              <Divider my="md" />
              <ProveedorList
                proveedores={proveedores}
                onEditar={abrirEditarProveedor}
                onEliminar={solicitarEliminacion}
                isMobile={isMobile}
              />
            </Paper>
          </Grid.Col>

          {/* Formulario */}
          {mostrarForm && (
            <Grid.Col span={gridSpans.form}>
              <Card 
                withBorder 
                shadow="lg" 
                p={isMobile ? "md" : "lg"} 
                radius="md" 
                className="form-card"
                style={{
                  position: isMobile ? 'fixed' : 'sticky',
                  top: isMobile ? 0 : 20,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1000,
                  margin: isMobile ? 0 : 'auto',
                  height: isMobile ? '100vh' : 'auto',
                  overflowY: isMobile ? 'auto' : 'visible'
                }}
              >
                <div className="form-header">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <div>
                      <Title order={isMobile ? 4 : 3} className="gradient-title">
                        {proveedorEditando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                      </Title>
                      <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                        {proveedorEditando ? 'Modifica la información' : 'Completa los datos'}
                      </Text>
                    </div>
                    <ActionIcon
                      size={isMobile ? "md" : "lg"}
                      onClick={cerrarFormulario}
                      className="close-btn"
                    >
                      <IconX size={isMobile ? 16 : 20} />
                    </ActionIcon>
                  </Group>
                </div>
                <Divider my="md" />
                <ProveedorForm
                  proveedor={proveedorEditando}
                  onGuardar={handleGuardarProveedor}
                  isMobile={isMobile}
                />
              </Card>
            </Grid.Col>
          )}
        </Grid>

        {/* Modal de Confirmación de Eliminación */}
        {mostrarConfirmacion && (
           <Modal
              titulo={<span className="titulo-gradiente">Confirmar Eliminación</span>}
              onClose={cancelarEliminacion}
              tamaño="normal"
                >
            <div className="modal-eliminar-content">
              <div className="eliminar-icon">
                <IconTrash size={48} color="#e53e3e" />
              </div>
              
              <Text ta="center" size="lg" fw={600} mb="md">
                ¿Estás seguro de que quieres eliminar este proveedor?
              </Text>
              
             

              <Text ta="center" c="dimmed" size="sm" mb="xl">
                ⚠️ El proveedor cambiará a estado "desactivado" y no aparecerá en la lista principal.
              </Text>

              <Group justify="center" gap="md">
                <Button 
                  variant="light" 
                  onClick={cancelarEliminacion}
                  size="md"
                  className="btn-cancelar"
                >
                  Cancelar
                </Button>
                <Button 
                  color="red" 
                  onClick={() => eliminarProveedor(proveedorAEliminar?.id)}
                  size="md"
                  leftSection={<IconTrash size={16} />}
                  className="btn-confirmar"
                >
                  Confirmar Eliminación
                </Button>
              </Group>
            </div>
          </Modal>
        )}
      </Container>
    </div>
  );
}