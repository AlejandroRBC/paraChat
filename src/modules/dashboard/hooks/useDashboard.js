import { useState, useEffect } from 'react';

// Datos mock para el dashboard
const productosMock = [
  {
    id: 1,
    nombre: 'Paracetamol',
    stock: 1,
    laboratorio: 'Laboratorio ABC',
    estado: 'Crítico'
  },
  {
    id: 2,
    nombre: 'Ibuprofeno',
    stock: 3,
    laboratorio: 'Lab Farma',
    estado: 'Bajo'
  },
  {
    id: 3,
    nombre: 'Amoxicilina',
    stock: 12,
    laboratorio: 'Lab Salud',
    estado: 'Bueno'
  }
];

const ventasMensualesMock = [
  { mes: 'Ene', ventas: 2000, productos: 420, nroVentas: 45 },
  { mes: 'Feb', ventas: 1500, productos: 380, nroVentas: 38 },
  { mes: 'Mar', ventas: 2000, productos: 450, nroVentas: 42 },
  { mes: 'Abr', ventas: 1800, productos: 490, nroVentas: 40 },
  { mes: 'May', ventas: 1600, productos: 410, nroVentas: 35 },
  { mes: 'Jun', ventas: 1700, productos: 520, nroVentas: 37 },
  { mes: 'Jul', ventas: 2100, productos: 440, nroVentas: 48 },
  { mes: 'Ago', ventas: 2400, productos: 470, nroVentas: 52 },
  { mes: 'Sep', ventas: 2500, productos: 430, nroVentas: 55 },
  { mes: 'Oct', ventas: 1400, productos: 510, nroVentas: 32 },
  { mes: 'Nov', ventas: 1900, productos: 460, nroVentas: 45 },
  { mes: 'Dic', ventas: 2050, productos: 550, nroVentas: 46 }
];

const topProductosMock = [
  { nombre: 'Paracetamol 500mg', ventas: 245, categoria: 'Analgésicos' },
  { nombre: 'Amoxicilina 250mg', ventas: 189, categoria: 'Antibióticos' },
  { nombre: 'Loratadina 10mg', ventas: 167, categoria: 'Antialérgicos' },
  { nombre: 'Omeprazol 20mg', ventas: 156, categoria: 'Digestivos' },
  { nombre: 'Ibuprofeno 400mg', ventas: 143, categoria: 'Antiinflamatorios' },
  { nombre: 'Paracetamol 500mg', ventas: 245, categoria: 'Analgésicos' },
  { nombre: 'Amoxicilina 250mg', ventas: 189, categoria: 'Antibióticos' },
  { nombre: 'Loratadina 10mg', ventas: 167, categoria: 'Antialérgicos' },
  { nombre: 'Omeprazol 20mg', ventas: 156, categoria: 'Digestivos' },
  { nombre: 'Ibuprofeno 400mg', ventas: 143, categoria: 'Antiinflamatorios' },
  { nombre: 'Paracetamol 500mg', ventas: 245, categoria: 'Analgésicos' },
  { nombre: 'Amoxicilina 250mg', ventas: 189, categoria: 'Antibióticos' },
  { nombre: 'Loratadina 10mg', ventas: 167, categoria: 'Antialérgicos' },
  { nombre: 'Omeprazol 20mg', ventas: 156, categoria: 'Digestivos' },
  { nombre: 'Ibuprofeno 400mg', ventas: 143, categoria: 'Antiinflamatorios' }
];

const productosVencerMock = [
  {
    id: 1,
    nombre: 'Azitromicina',
    laboratorio: 'Laboratorio ABC',
    fechaVencimiento: '2025-04-21',
    diasRestantes: 5
  },
  {
    id: 2,
    nombre: 'Loratadina',
    laboratorio: 'Lab Farma',
    fechaVencimiento: '2025-05-15',
    diasRestantes: 30
  }
];

export const useDashboard = () => {
  const [metricas, setMetricas] = useState({
    totalHoy: 0,
    productosVendidos: 0,
    ventasHoy: 0,
    // AGREGAR DATOS DE AYER PARA COMPARACIÓN
    totalAyer: 0,
    productosAyer: 0,
    ventasAyer: 0
  });
  const [productosBajos, setProductosBajos] = useState([]);
  const [productosPorVencer, setProductosPorVencer] = useState([]);
  const [loading, setLoading] = useState(true);

  // FUNCIÓN PARA CALCULAR PORCENTAJES
  const calcularPorcentaje = (valorHoy, valorAyer) => {
    if (valorAyer === 0) return '+100%'; // Evitar división por cero
    const diferencia = valorHoy - valorAyer;
    const porcentaje = (diferencia / valorAyer) * 100;
    return porcentaje > 0 ? `+${porcentaje.toFixed(1)}%` : `${porcentaje.toFixed(1)}%`;
  };

  // FUNCIÓN PARA DETERMINAR TENDENCIA
  const determinarTendencia = (valorHoy, valorAyer) => {
    return valorHoy >= valorAyer ? 'up' : 'down';
  };

  useEffect(() => {
    // Simular carga de datos
    const cargarDatos = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // DATOS ACTUALES (HOY)
      const datosHoy = {
        totalHoy: 2394.50,
        productosVendidos: 45,
        ventasHoy: 12
      };

      // DATOS DE AYER (para comparación realista)
      const datosAyer = {
        totalAyer: 2100.00,    // +14% más que ayer
        productosAyer: 40,      // +12.5% más que ayer  
        ventasAyer: 15         // -20% menos que ayer
      };

      setMetricas({
        ...datosHoy,
        ...datosAyer
      });
      
      setProductosBajos(productosMock);
      setProductosPorVencer(productosVencerMock);
      
      setLoading(false);
    };

    cargarDatos();
  }, []);

  return {
    metricas,
    productosBajos,
    productosPorVencer,
    ventasMensuales: ventasMensualesMock,
    topProductos: topProductosMock,
    loading,
    // EXPORTAR FUNCIONES DE CÁLCULO
    calcularPorcentaje,
    determinarTendencia
  };
};