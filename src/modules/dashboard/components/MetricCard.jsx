// components/MetricCard.jsx - VERSIÓN SIN CSS INLINE
import { Paper, Text, Group, ThemeIcon, Badge } from '@mantine/core';
import { 
  IconCurrencyDollar, 
  IconPackage, 
  IconShoppingCart,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';
import '../dashboard.css';  // ✅ CSS separado

function MetricCard({ 
  valor, 
  etiqueta, 
  sufijo = '', 
  color, 
  porcentaje, 
  tendencia 
}) {
  const formattedValue = typeof valor === 'number' && sufijo === 'Bs' 
    ? `Bs ${valor.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`
    : valor.toLocaleString();

  // Iconos según el tipo de métrica
  const getIcon = () => {
    if (sufijo === 'Bs') return <IconCurrencyDollar size={28} />;
    if (etiqueta.includes('Productos')) return <IconPackage size={28} />;
    if (etiqueta.includes('Ventas')) return <IconShoppingCart size={28} />;
    return <IconTrendingUp size={28} />;
  };

  // Color de tendencia REAL
  const tendenciaColor = tendencia === 'up' ? 'green' : 'red';
  const tendenciaIcon = tendencia === 'up' ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />;

  return (
    <Paper 
      p="xl" 
      withBorder 
      radius="lg"
      shadow="md"
      className="metric-card"
      style={{ borderLeft: `8px solid ${color}`, }}  // ✅ Solo el color dinámico queda inline
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Text size="sm" c="dimmed" fw={600} className="metric-label">
            {etiqueta}
          </Text>
          
          <Text size="32px" fw={800} c={color} className="metric-value">
            {formattedValue}
          </Text>

          {/* Badge de tendencia REAL */}
          <Badge 
            color={tendenciaColor} 
            variant="light" 
            leftSection={tendenciaIcon}
            size="sm"
            style={{ borderRadius: '12px' }}
          >
            {porcentaje} vs ayer
          </Badge>
        </div>

        {/* Icono principal */}
        <ThemeIcon 
          size="xl" 
          variant="light" 
          color={color}
          className="metric-icon"
        >
          {getIcon()}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

export default MetricCard;