import { Modal, Table, Badge, Text, Group, Paper, Title, Alert, ScrollArea, Box, ActionIcon } from '@mantine/core';
import { IconAlertTriangle, IconPackage, IconCheck, IconX } from '@tabler/icons-react';
import '../dashboard.css';  // ✅ CSS separado

function ProductosBajosModal({ productos, opened, onClose }) {
  // Determinar estado basado en stock
  const getEstado = (stock) => {
    if (stock < 4) return 'Crítico';
    if (stock < 11 && stock > 3) return 'Bajo';
    return 'Bueno';
  };

  const getBadgeColor = (stock) => {
    if (stock < 4) return 'red';
    if (stock < 11 && stock > 3) return 'orange';
    return 'green';
  };

  const getBadgeVariant = (stock) => {
    return stock < 4 ? 'filled' : 'light';
  };

  const productosCriticos = productos.filter(p => p.stock < 4).length;
  const productosBajos = productos.filter(p => p.stock < 11 && p.stock > 3).length;
  const productosNecesitanAtencion = productosCriticos + productosBajos;

  const getBorderColor = (stock) => {
    if (stock < 4) return '#ff6b6b';
    if (stock < 11) return '#ffa94d';
    return '#51cf66';
  };

  const rows = productos.map((producto) => {
    const estado = getEstado(producto.stock);
    const badgeColor = getBadgeColor(producto.stock);
    const borderColor = getBorderColor(producto.stock);
    
    return (
      <Table.Tr 
        key={producto.id} 
        className="product-row"
        style={{ borderLeft: `3px solid ${borderColor}` }}  // ✅ Solo color dinámico
      >
        <Table.Td className="product-cell">
          <Group gap="sm">
            <IconPackage size={16} color={badgeColor} />
            <div>
              <Text fw={600} size="sm" c="dark.8">{producto.nombre}</Text>
              <Text size="xs" c="dimmed">ID: {producto.id}</Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td className="product-cell">
          <Badge 
            color={badgeColor}
            variant={getBadgeVariant(producto.stock)}
            size="sm"
            radius="sm"
          >
            {producto.stock} unidades
          </Badge>
        </Table.Td>
        <Table.Td className="product-cell">
          <Group gap="xs">
            <Badge 
              color={badgeColor}
              variant={getBadgeVariant(producto.stock)}
              size="sm"
              radius="sm"
              className="status-badge"
            >
              {estado}
            </Badge>
            {producto.stock < 4 && (
              <IconAlertTriangle size={14} color="#ff6b6b" />
            )}
            {producto.stock > 10 && (
              <IconCheck size={14} color="#51cf66" />
            )}
          </Group>
        </Table.Td>
        <Table.Td className="product-cell">
          <Text fw={500} size="sm" c="dark.7">{producto.laboratorio}</Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title={
        <Group className="modal-header-container">
          <Group gap="lg">
            <div className="modal-icon-container">
              <IconAlertTriangle size={22} color="white" />
            </div>
            <div>
              <Title order={3} c="dark.8" className="modal-title">
                Control de Inventario
              </Title>
              <Text size="sm" c="dimmed" className="modal-subtitle">
                Productos por debajo del stock mínimo
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
        className="modal-close-btn"
      >
        <IconX size={20} />
      </ActionIcon>

      {productos.length === 0 ? (
        <Alert color="green" title="Todo en orden" icon={<IconPackage size={16} />} radius="md">
          No hay productos con stock bajo en este momento.
        </Alert>
      ) : (
        <>
          {/* ALERTA CON COLORES VERDE AZULADO */}
          <Box className="alert-container">
            <Alert 
              color="blue" 
              mb="md" 
              icon={<IconAlertTriangle size={16} color="#1871c1" />} 
              radius="md"
              className="stock-alert"
            >
              <Text fw={500}>{productosNecesitanAtencion} productos necesitan atención</Text>
            </Alert>
          </Box>

          <Paper withBorder radius="md" className="table-paper">
            <Table verticalSpacing={2} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>PRODUCTO</Table.Th>
                  <Table.Th>STOCK</Table.Th>
                  <Table.Th>ESTADO</Table.Th>
                  <Table.Th>LABORATORIO</Table.Th>
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
              {productosBajos > 0 && (
                <Badge color="orange" variant="light" size="sm">
                  {productosBajos} bajos
                </Badge>
              )}
            </Group>
          </Group>
        </>
      )}
    </Modal>
  );
}

export default ProductosBajosModal;