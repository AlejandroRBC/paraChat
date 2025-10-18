import { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { 
  Container, 
  Grid, 
  Group, 
  Button, 
  LoadingOverlay
} from '@mantine/core';
import { useMediaQuery } from 'react-responsive'; // ✅ NUEVO
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ProductosBajosModal from './components/ProductosBajosModal';
import ProductosVencerModal from './components/ProductosVencerModal';
import VentasChart from './components/VentasChart';
import TopProductos from './components/TopProductos';
import './dashboard.css';

function Dashboard() {
  const {
    metricas,
    productosBajos,
    productosPorVencer,
    ventasMensuales,
    topProductos,
    loading,
    calcularPorcentaje,
    determinarTendencia
  } = useDashboard();

  // ✅ RESPONSIVE HOOKS
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  

  const [mostrarBajos, setMostrarBajos] = useState(false);
  const [mostrarVencer, setMostrarVencer] = useState(false);

  if (loading) {
    return (
      <Container size="xl" py="md">
        <LoadingOverlay visible />
      </Container>
    );
  }

  return (
    <Container 
      size={isMobile ? "sm" : isTablet ? "md" : "xl"} // ✅ RESPONSIVE
      py="md" 
      className="dashboard-main-container"
    >
      {/* 1. HEADER */}
      <Header 
        productosBajos={productosBajos}
        productosPorVencer={productosPorVencer}
      />

      {/* 2. MÉTRICAS - RESPONSIVE */}
      <Grid mt="xl">
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}> {/* ✅ RESPONSIVE */}
          <MetricCard
            valor={metricas.totalHoy}
            etiqueta="Total de Hoy"
            sufijo="Bs"
            color="#034C8C"
            porcentaje={calcularPorcentaje(metricas.totalHoy, metricas.totalAyer)}
            tendencia={determinarTendencia(metricas.totalHoy, metricas.totalAyer)}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}> {/* ✅ RESPONSIVE */}
          <MetricCard
            valor={metricas.productosVendidos}
            etiqueta="Productos Vendidos"
            color="#04BFBF"
            porcentaje={calcularPorcentaje(metricas.productosVendidos, metricas.productosAyer)}
            tendencia={determinarTendencia(metricas.productosVendidos, metricas.productosAyer)}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : isTablet ? 6 : 4}> {/* ✅ RESPONSIVE */}
          <MetricCard
            valor={metricas.ventasHoy}
            etiqueta="Ventas Hoy"
            color="#ABB4B2"
            porcentaje={calcularPorcentaje(metricas.ventasHoy, metricas.ventasAyer)}
            tendencia={determinarTendencia(metricas.ventasHoy, metricas.ventasAyer)}
          />
        </Grid.Col>
      </Grid>

      {/* 3. DASHBOARD (Gráfica de ventas) - RESPONSIVE */}
      <Grid mt="xl">
        <Grid.Col span={{ 
          base: 12, 
          lg: isMobile ? 12 : isTablet ? 8 : 8 // ✅ RESPONSIVE MEJORADO
        }}>
          <VentasChart data={ventasMensuales} />
        </Grid.Col>

        {/* 4. TOP PRODUCTOS - RESPONSIVE */}
        <Grid.Col span={{ 
          base: 12, 
          lg: isMobile ? 12 : isTablet ? 4 : 4 // ✅ RESPONSIVE MEJORADO
        }}>
          <TopProductos productos={topProductos} />
        </Grid.Col>
      </Grid>

      {/* 5. BOTONES - RESPONSIVE */}
      <Group 
        className="dashboard-buttons-container" 
        mt="xl" 
        justify="center"
        direction={isMobile ? "column" : "row"} // ✅ RESPONSIVE
        gap={isMobile ? "md" : "xl"} // ✅ RESPONSIVE
      >
        <Button 
          size={isMobile ? "sm" : "md"} // ✅ RESPONSIVE
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          leftSection="⚠️"
          onClick={() => setMostrarBajos(true)}
          className="dashboard-button"
          fullWidth={isMobile} // ✅ RESPONSIVE
        >
          {isMobile ? 'STOCK BAJO' : 'PRODUCTOS POR ACABARSE'} {/* ✅ RESPONSIVE */}
        </Button>
        
        <Button 
          size={isMobile ? "sm" : "md"} // ✅ RESPONSIVE
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          leftSection="📅"
          onClick={() => setMostrarVencer(true)}
          className="dashboard-button"
          fullWidth={isMobile} // ✅ RESPONSIVE
        >
          {isMobile ? 'POR VENCER' : 'PRODUCTOS POR VENCER'} {/* ✅ RESPONSIVE */}
        </Button>
      </Group>

      {/* MODALES */}
      <ProductosBajosModal
        productos={productosBajos}
        opened={!!mostrarBajos}
        onClose={() => setMostrarBajos(false)}
        size={isMobile ? "sm" : "xl"} // ✅ RESPONSIVE
      />

      <ProductosVencerModal
        productos={productosPorVencer}
        opened={!!mostrarVencer}
        onClose={() => setMostrarVencer(false)}
        size={isMobile ? "sm" : "xl"} // ✅ RESPONSIVE
      />
    </Container>
  );
}

export default Dashboard;