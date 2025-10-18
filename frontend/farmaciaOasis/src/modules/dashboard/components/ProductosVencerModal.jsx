import { Modal, Table, Badge, Text, Group, Paper, Title, Alert, ScrollArea, Box, ActionIcon } from '@mantine/core';
import { IconCalendarExclamation, IconCalendar, IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';
import '../dashboard.css';  // ✅ CSS separado

function ProductosVencerModal({ productos, opened, onClose }) {
  const getBadgeColor = (dias) => {
    if (dias <= 7) return 'red';
    if (dias <= 30) return 'orange';
    return 'green';
  };

  const getBadgeVariant = (dias) => {
    return dias <= 7 ? 'filled' : 'light';
  };

  const productosCriticos = productos.filter(p => p.diasRestantes <= 7).length;
  const productosAdvertencia = productos.filter(p => p.diasRestantes > 7 && p.diasRestantes <= 30).length;
  const productosNecesitanAtencion = productosCriticos + productosAdvertencia;

  const getBorderColor = (dias) => {
    if (dias <= 7) return '#ff6b6b';
    if (dias <= 30) return '#ffa94d';
    return '#51cf66';
  };

  const rows = productos.map((producto) => {
    const badgeColor = getBadgeColor(producto.diasRestantes);
    const borderColor = getBorderColor(producto.diasRestantes);
    
    return (
      <Table.Tr 
        key={producto.id}
        className="vencer-product-row"
        style={{ borderLeft: `3px solid ${borderColor}` }}  // ✅ Solo color dinámico
      >
        <Table.Td className="vencer-product-cell">
          <Group gap="sm">
            <IconCalendar size={16} color={badgeColor} />
            <div>
              <Text fw={600} size="sm" c="dark.8">{producto.nombre}</Text>
              <Text size="xs" c="dimmed">ID: {producto.id}</Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td className="vencer-product-cell">
          <Text fw={500} size="sm" c="dark.7">{producto.laboratorio}</Text>
        </Table.Td>
        <Table.Td className="vencer-product-cell">
          <Text fw={500} size="sm">
            {new Date(producto.fechaVencimiento).toLocaleDateString('es-ES')}
          </Text>
        </Table.Td>
        <Table.Td className="vencer-product-cell">
          <Group gap="xs">
            <Badge 
              color={badgeColor}
              variant={getBadgeVariant(producto.diasRestantes)}
              size="sm"
              radius="sm"
              className="vencer-status-badge"
            >
              {producto.diasRestantes} días
            </Badge>
            {producto.diasRestantes <= 7 && (
              <IconAlertTriangle size={14} color="#ff6b6b" />
            )}
            {producto.diasRestantes > 30 && (
              <IconCheck size={14} color="#51cf66" />
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title={
        <Group className="vencer-modal-header-container">
          <Group gap="lg">
            <div className="vencer-modal-icon-container">
              <IconCalendarExclamation size={22} color="white" />
            </div>
            <div>
              <Title order={3} c="dark.8" className="vencer-modal-title">
                Control de Vencimientos
              </Title>
              <Text size="sm" c="dimmed" className="vencer-modal-subtitle">
                Productos próximos a vencer
              </Text>
            </div>
          </Group>
        </Group>
      }
      size="xl"
      overlayProps={{ blur: 3 }}
      radius="lg"
      centered
      withCloseButton={false}
      scrollAreaComponent={ScrollArea.Autosize}
      styles={{
        content: {
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e9ecef'
        },
        header: {
          background: 'white',
          borderBottom: '1px solid #f1f3f5',
          marginBottom: 0,
          padding: '20px',
          position: 'relative'
        }
      }}
    >
      {/* X TRANSPARENTE FIJA EN LA ESQUINA SUPERIOR DERECHA */}
      <ActionIcon 
        variant="subtle" 
        color="gray" 
        onClick={onClose}
        size="xl"
        radius="md"
        className="vencer-modal-close-btn"
      >
        <IconX size={20} />
      </ActionIcon>

      {productos.length === 0 ? (
        <Alert color="green" title="Todo en orden" icon={<IconCalendar size={16} />} radius="md">
          No hay productos por vencer en los próximos 60 días.
        </Alert>
      ) : (
        <>
          {/* ALERTA CON BORDE IZQUIERDO GRUESO Y HOVER */}
          <Box className="vencer-alert-container">
            <Alert 
              color="blue" 
              mb="md" 
              icon={<IconCalendarExclamation size={16} color="#1871c1" />} 
              radius="md"
              className="vencer-alert"
            >
              <Text fw={500}>{productosNecesitanAtencion} productos necesitan atención</Text>
            </Alert>
          </Box>

          <Paper withBorder radius="md" className="vencer-table-paper">
            <Table verticalSpacing={2} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>PRODUCTO</Table.Th>
                  <Table.Th>LABORATORIO</Table.Th>
                  <Table.Th>FECHA VENCIMIENTO</Table.Th>
                  <Table.Th>DÍAS RESTANTES</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Paper>

          <Group justify="space-between" mt="md">
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Monitoreando: {productos.length} productos
              </Text>
              {productosCriticos > 0 && (
                <Badge color="red" variant="light" size="sm">
                  {productosCriticos} críticos
                </Badge>
              )}
              {productosAdvertencia > 0 && (
                <Badge color="orange" variant="light" size="sm">
                  {productosAdvertencia} advertencia
                </Badge>
              )}
            </Group>
          </Group>
        </>
      )}
    </Modal>
  );
}

export default ProductosVencerModal;