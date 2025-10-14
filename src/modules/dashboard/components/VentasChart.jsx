// components/VentasChart.jsx - VERSIÓN SIN CSS INLINE
import { useState } from 'react';
import { Paper, Title, Text, Group, Badge, ThemeIcon, Select, Button } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconTrendingUp, IconCurrencyDollar, IconChartLine, IconPackage, IconReceipt } from '@tabler/icons-react';
import '../dashboard.css';  // ✅ CSS separado

function VentasChart({ data }) {
  const [año, setAño] = useState(2024);
  const [tipoGrafica, setTipoGrafica] = useState('monto'); // 'monto' o 'numero'
  
  // Calcular métricas funcionales con datos mock
  const totalVentas = data.reduce((sum, item) => sum + item.ventas, 0);
  const totalProductos = data.reduce((sum, item) => sum + item.productos, 0);
  const totalNroVentas = data.reduce((sum, item) => sum + item.nroVentas, 0);
  const promedioVentas = totalVentas / data.length;
  const promedioNroVentas = totalNroVentas / data.length;
  
  // TENDENCIA CORREGIDA - Dinámica según tipo de gráfica
  const crecimiento = data.length > 1 ? 
    ((data[data.length - 1][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] - 
      data[data.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas']) / 
     data[data.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] * 100).toFixed(1) : 0;
  
  // MEJOR Y PEOR MES CORREGIDOS - Dinámicos según tipo de gráfica
  const mejorMes = tipoGrafica === 'monto' 
    ? data.reduce((max, item) => item.ventas > max.ventas ? item : max)
    : data.reduce((max, item) => item.nroVentas > max.nroVentas ? item : max);

  const peorMes = tipoGrafica === 'monto'
    ? data.reduce((min, item) => item.ventas < min.ventas ? item : min)
    : data.reduce((min, item) => item.nroVentas < min.nroVentas ? item : min);

  // Años disponibles para el filtro
  const años = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  // Datos para la gráfica según el tipo seleccionado
  const datosGrafica = tipoGrafica === 'monto' 
    ? data.map(item => ({ ...item, valor: item.ventas, nombre: 'Monto Ventas' }))
    : data.map(item => ({ ...item, valor: item.nroVentas, nombre: 'Número de Ventas' }));

  const colorLinea = tipoGrafica === 'monto' ? '#034C8C' : '#8B5CF6';
  const totalActual = tipoGrafica === 'monto' ? totalVentas : totalNroVentas;
  const promedioActual = tipoGrafica === 'monto' ? promedioVentas : promedioNroVentas;

  return (
    <Paper p="xl" withBorder radius="lg" shadow="md" className="ventas-chart-container">
      {/* Header con filtro y métricas */}
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Group gap="sm" mb="xs">
            <ThemeIcon size="lg" color="blue" variant="light">
              <IconChartLine size={20} />
            </ThemeIcon>
            <Title order={2} c="dark.8" className="ventas-chart-title">
              Análisis de Ventas {año}
            </Title>
          </Group>
          <Text size="sm" c="dimmed" className="ventas-chart-subtitle">
            Tendencias mensuales y comportamiento comercial
          </Text>
        </div>
        
        <Group gap="lg">
          {/* Filtro de Año */}
          <Select
            label="Año"
            placeholder="Selecciona año"
            value={año.toString()}
            onChange={(value) => setAño(parseInt(value))}
            data={años}
            style={{ width: 120 }}
            size="sm"
          />
          
          <div className="total-badge-container">
            <Badge color="blue" variant="light" size="sm" mb="xs">
              TOTAL {año}
            </Badge>
            <Text fw={800} size="xl" c="blue.6">
              {tipoGrafica === 'monto' ? 'Bs ' : ''}{totalActual.toLocaleString('es-ES')}
            </Text>
          </div>
          
          <div className="tendencia-badge-container">
            <Badge color={crecimiento >= 0 ? "green" : "red"} variant="light" size="sm" mb="xs">
              {crecimiento >= 0 ? "📈" : "📉"} TENDENCIA
            </Badge>
            <Text fw={800} size="xl" c={crecimiento >= 0 ? "green.6" : "red.6"}>
              {crecimiento >= 0 ? "+" : ""}{crecimiento}%
            </Text>
          </div>
        </Group>
      </Group>

      {/* Selector de tipo de gráfica - BOTONES INTERACTIVOS */}
      <Group justify="center" mb="md" gap="sm">
        <Button
          variant={tipoGrafica === 'monto' ? 'filled' : 'light'}
          color="blue"
          leftSection={<IconCurrencyDollar size={16} />}
          onClick={() => setTipoGrafica('monto')}
          size="md"
          radius="xl"
          className="chart-type-button"
        >
          Monto Ventas (Bs)
        </Button>
        
        <Button
          variant={tipoGrafica === 'numero' ? 'filled' : 'light'}
          color="violet"
          leftSection={<IconReceipt size={16} />}
          onClick={() => setTipoGrafica('numero')}
          size="md"
          radius="xl"
          className="chart-type-button"
        >
          Número de Ventas
        </Button>
      </Group>

      {/* Gráfica dinámica según selección */}
      <div className="chart-container">
        <ResponsiveContainer>
          <LineChart data={datosGrafica}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="mes" 
              tick={{ fill: '#666', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
              tickFormatter={(value) => 
                tipoGrafica === 'monto' ? `Bs ${value}` : `${value}`
              }
            />
            
            <Tooltip 
              formatter={(value) => [
                tipoGrafica === 'monto' ? `Bs ${value.toLocaleString('es-ES')}` : `${value}`,
                tipoGrafica === 'monto' ? 'Monto Ventas' : 'Número de Ventas'
              ]}
              labelFormatter={(label) => `Mes: ${label}`}
              contentStyle={{ 
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                background: 'white',
                fontSize: '14px',
                fontWeight: 600
              }}
              labelStyle={{
                fontWeight: 700,
                color: colorLinea,
                fontSize: '13px'
              }}
            />
            
            {/* Línea dinámica según selección */}
            <Line 
              type="linear" 
              dataKey="valor" 
              stroke={colorLinea}
              strokeWidth={3}
              dot={false}
              activeDot={false}
              name={tipoGrafica === 'monto' ? 'Monto Ventas' : 'Número de Ventas'}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer con metricas dinamicas */}
        <Group direction="column" gap="md" mt="lg" p="md" className="ventas-chart-footer">
          {/* FILA SUPERIOR - SIEMPRE 3 MÉTRICAS */}
          <Group justify="space-around" w="100%">
            {/* Promedio Mensual - SIEMPRE PRESENTE */}
            <Group gap="md" className="metric-group">
              <ThemeIcon className="metric-icon" color="blue" variant="light">
                <IconCurrencyDollar size={18} />
              </ThemeIcon>
              <div>
                <Text className="metric-label">
                  {tipoGrafica === 'monto' ? 'Promedio Mensual' : 'Prom. Ventas/Mes'}
                </Text>
                <Text className="metric-value" c="blue.6">
                  {tipoGrafica === 'monto' ? 'Bs ' : ''}{promedioActual.toLocaleString('es-ES', { maximumFractionDigits: tipoGrafica === 'monto' ? 0 : 1 })}
                </Text>
              </div>
            </Group>
            
            {/* Mejor Mes - SIEMPRE PRESENTE */}
            <Group gap="md" className="metric-group">
              <ThemeIcon className="metric-icon" color="green" variant="light">
                <IconTrendingUp size={18} />
              </ThemeIcon>
              <div>
                <Text className="metric-label">
                  {tipoGrafica === 'monto' ? 'Mejor Mes' : 'Mes Más Ventas'}
                </Text>
                <Text className="metric-value" c="green.6">
                  {mejorMes.mes}
                </Text>
                <Text className="metric-detail">
                  {tipoGrafica === 'monto' 
                    ? `Bs ${mejorMes.ventas.toLocaleString('es-ES')}`
                    : `${mejorMes.nroVentas} ventas`
                  }
                </Text>
              </div>
            </Group>
            
            {/* Mes Más Bajo - SIEMPRE PRESENTE */}
            <Group gap="md" className="metric-group">
              <ThemeIcon className="metric-icon" color="orange" variant="light">
                <IconChartLine size={18} />
              </ThemeIcon>
              <div>
                <Text className="metric-label">Mes Más Bajo</Text>
                <Text className="metric-value" c="orange.6">
                  {peorMes.mes}
                </Text>
                <Text className="metric-detail">
                  {tipoGrafica === 'monto' 
                    ? `Bs ${peorMes.ventas.toLocaleString('es-ES')}`
                    : `${peorMes.nroVentas} ventas`
                  }
                </Text>
              </div>
            </Group>
          </Group>

          {/* FILA INFERIOR - SIEMPRE 2 MÉTRICAS */}
          <Group justify="space-around" w="100%">
            {/* Total Productos - SIEMPRE PRESENTE */}
            <Group gap="md" className="metric-group">
              <ThemeIcon className="metric-icon" color="cyan" variant="light">
                <IconPackage size={18} />
              </ThemeIcon>
              <div>
                <Text className="metric-label">Total Productos</Text>
                <Text className="metric-value" c="cyan.6">
                  {totalProductos.toLocaleString('es-ES')}
                </Text>
                <Text className="metric-detail">
                  unidades
                </Text>
              </div>
            </Group>

            {/* Nro. de Ventas - SIEMPRE PRESENTE */}
            <Group gap="md" className="metric-group">
              <ThemeIcon className="metric-icon" color="violet" variant="light">
                <IconReceipt size={18} />
              </ThemeIcon>
              <div>
                <Text className="metric-label">Nro. de Ventas</Text>
                <Text className="metric-value" c="violet.6">
                  {totalNroVentas.toLocaleString('es-ES')}
                </Text>
                <Text className="metric-detail">
                  transacciones
                </Text>
              </div>
            </Group>
          </Group>
        </Group>
    </Paper>
  );
}

export default VentasChart;