// components/TopProductos.jsx - VERSIÓN CON CLASES CSS PERSONALIZADAS
import { Paper, Title, Table, Badge, Text, Group, ThemeIcon, Progress, Stack, ScrollArea, Box } from '@mantine/core';
import { IconCrown, IconStar, IconTrendingUp, IconAward } from '@tabler/icons-react';
import '../dashboard.css';  // ✅ CSS separado

function TopProductos({ productos }) {
  // MOSTRAR TODOS los productos, no hacer slice
  const todosProductos = productos;
  const totalProductos = productos.length;
  
  // Calcular venta máxima para la barra de progreso
  const maxVentas = Math.max(...todosProductos.map(p => p.ventas));
  
  // Colores para cada posición
  const getPositionColor = (index) => {
    const colors = {
      0: { badge: 'yellow', icon: 'gold', bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
      1: { badge: 'gray', icon: 'silver', bg: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)' },
      2: { badge: 'orange', icon: 'bronze', bg: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)' },
      default: { badge: 'blue', icon: 'blue', bg: 'linear-gradient(135deg, #228BE6 0%, #1C7ED6 100%)' }
    };
    return colors[index] || colors.default;
  };

  // Iconos para cada posición
  const getPositionIcon = (index) => {
    const icons = {
      0: <IconCrown size={16} />,
      1: <IconAward size={16} />,
      2: <IconStar size={16} />,
      default: <IconTrendingUp size={16} />
    };
    return icons[index] || icons.default;
  };

  const getProgressColor = (index) => {
    if (index === 0) return 'yellow';
    if (index === 1) return 'gray';
    if (index === 2) return 'orange';
    return 'blue';
  };

  const rows = todosProductos.map((producto, index) => {
    const positionColors = getPositionColor(index);
    const porcentaje = (producto.ventas / maxVentas) * 100;
    const progressColor = getProgressColor(index);
    
    return (
      <Table.Tr 
        key={producto.nombre} 
        className="mantine-Table-tr" // ✅ Usando tus clases CSS
      >
        <Table.Td className="mantine-Table-td">
          <Badge 
            size="md"
            variant="gradient"
            gradient={{ 
              from: positionColors.badge, 
              to: positionColors.badge, 
              deg: 135 
            }}
            leftSection={getPositionIcon(index)}
          >
            #{index + 1}
          </Badge>
        </Table.Td>
        
        <Table.Td className="mantine-Table-td">
          <Stack gap={2}>
            <Text fw={700} size="sm" c="dark.8" lineClamp={1}>
              {producto.nombre}
            </Text>
            <Badge 
              size="xs" 
              variant="light" 
              color="gray"
            >
              {producto.categoria}
            </Badge>
          </Stack>
        </Table.Td>
        
        <Table.Td className="mantine-Table-td">
          <Stack gap="xs" w="100%">
            <Group justify="space-between" gap="xs">
              <Group gap={4}>
                <ThemeIcon size="sm" color="blue" variant="light">
                  <IconTrendingUp size={12} />
                </ThemeIcon>
                <Text fw={800} size="sm" c="blue.6">
                  {producto.ventas.toLocaleString('es-ES')}
                </Text>
              </Group>
              <Text size="xs" c="dimmed" fw={600}>
                {porcentaje.toFixed(0)}%
              </Text>
            </Group>
            
            <Progress 
              value={porcentaje} 
              color={progressColor}
              size="sm"
              radius="xl"
            />
          </Stack>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper 
      p="lg" 
      withBorder 
      radius="lg" 
      shadow="md"
      className="top-productos-container"
    >
      {/* Header compacto */}
      <Box className="top-productos-header">
        <Group justify="space-between" align="flex-start" mb="md">
          <Group gap="sm">
            <ThemeIcon 
              size="md" 
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange', deg: 135 }}
            >
              <IconCrown size={18} />
            </ThemeIcon>
            <div>
              <Title order={3} c="dark.8" className="top-productos-title">
                Top Productos
              </Title>
              <Text size="xs" c="dimmed" className="top-productos-subtitle">
                {totalProductos} productos en ranking
              </Text>
            </div>
          </Group>
          
          <Badge 
            size="md" 
            variant="gradient" 
            gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          >
            Top {totalProductos}
          </Badge>
        </Group>
      </Box>

      {/* Tabla con scroll */}
      <Box className="top-productos-content" style={{ height: '400px' }}>
        <ScrollArea 
          h={400}
          className="mantine-ScrollArea-root"
          scrollbarSize={6}
          type="auto"
        >
          <Table 
            className="mantine-Table-table"
            verticalSpacing="sm"
          >
            <Table.Thead className="mantine-Table-thead">
              <Table.Tr className="mantine-Table-tr">
                <Table.Th className="mantine-Table-th">
                  Pos
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  Producto
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  Ventas
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody className="mantine-Table-tbody">{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>

      {/* Footer compacto */}
      <Box className="top-productos-footer">
        <Group justify="space-between" mt="md" p="sm">
          <Group gap="xs">
            <ThemeIcon size="xs" color="green" variant="light">
              <IconTrendingUp size={12} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="xs" c="dark.7">Total Vendido</Text>
              <Text fw={800} size="sm" c="green.6">
                {todosProductos.reduce((sum, p) => sum + p.ventas, 0).toLocaleString('es-ES')}
              </Text>
            </div>
          </Group>
          
          {totalProductos > 10 && (
            <Text size="xs" c="dimmed" fw={600}>
              📜 {totalProductos} productos
            </Text>
          )}
        </Group>
      </Box>
    </Paper>
  );
}

export default TopProductos;