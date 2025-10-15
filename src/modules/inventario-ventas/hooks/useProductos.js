import { useState, useEffect } from 'react';

// Datos de ejemplo
const productosMock = [
  {
    id: 1,
    codigo: 'MED001',
    lote: 'LOTE1A45',
    nombre: 'Amoxicilina',
    presentacion: 'Cápsulas 500mg',
    precio_base: 12.50,
    precio_venta: 20.00,
    stock: 5,
    fecha_expiracion: '2026-03-15',
    laboratorio: 'PharmaGen',
    porcentaje_g: 40
  },
  {
    id: 2,
    codigo: 'MED002',
    lote: 'LOTE2B67',
    nombre: 'Losartán',
    presentacion: 'Tabletas 50mg',
    precio_base: 25.00,
    precio_venta: 38.00,
    stock: 12,
    fecha_expiracion: '2025-11-20',
    laboratorio: 'BioLife',
    porcentaje_g: 35
  },
  {
    id: 3,
    codigo: 'MED003',
    lote: 'LOTE3C89',
    nombre: 'Salbutamol',
    presentacion: 'Inhalador',
    precio_base: 45.00,
    precio_venta: 65.00,
    stock: 30,
    fecha_expiracion: '2026-06-01',
    laboratorio: 'AeroPharm',
    porcentaje_g: 50
  },
  {
    id: 4,
    codigo: 'MED004',
    lote: 'LOTE4D01',
    nombre: 'Omeprazol',
    presentacion: 'Cápsulas 20mg',
    precio_base: 9.80,
    precio_venta: 14.70,
    stock: 210,
    fecha_expiracion: '2025-09-10',
    laboratorio: 'GastroLab',
    porcentaje_g: 30
  },
  {
    id: 5,
    codigo: 'MED005',
    lote: 'LOTE5E23',
    nombre: 'Metformina',
    presentacion: 'Tabletas 850mg',
    precio_base: 18.00,
    precio_venta: 27.50,
    stock: 0,
    fecha_expiracion: '2026-01-25',
    laboratorio: 'Diabetech',
    porcentaje_g: 45
  },
  {
    id: 6,
    codigo: 'MED006',
    lote: 'LOTE6F45',
    nombre: 'Losartan',
    presentacion: 'Tabletas 100mg',
    precio_base: 5.50,
    precio_venta: 9.00,
    stock: 3,
    fecha_expiracion: '2027-02-14',
    laboratorio: 'Bayer',
    porcentaje_g: 50
  },
  {
    id: 7,
    codigo: 'MED007',
    lote: 'LOTE7G67',
    nombre: 'Clonazepam',
    presentacion: 'Gotas 2.5mg/ml',
    precio_base: 35.00,
    precio_venta: 52.50,
    stock:0,
    fecha_expiracion: '2025-10-05',
    laboratorio: 'NeuroCorp',
    porcentaje_g: 30
  },
  {
    id: 8,
    codigo: 'MED008',
    lote: 'LOTE8H89',
    nombre: 'Vitaminas C + Zinc',
    presentacion: 'Efervescente',
    precio_base: 15.00,
    precio_venta: 24.00,
    stock: 0,
    fecha_expiracion: '2026-12-30',
    laboratorio: 'VitaMax',
    porcentaje_g: 60
  },
  {
    id: 9,
    codigo: 'MED009',
    lote: 'LOTE9I01',
    nombre: 'Dexametasona',
    presentacion: 'Inyección 4mg/ml',
    precio_base: 22.00,
    precio_venta: 33.00,
    stock: 65,
    fecha_expiracion: '2025-07-01',
    laboratorio: 'SteroidInc',
    porcentaje_g: 50
  },
  {
    id: 10,
    codigo: 'MED010',
    lote: 'LOTE0J23',
    nombre: 'Loratadina',
    presentacion: 'Jarabe 5mg/5ml',
    precio_base: 11.20,
    precio_venta: 16.80,
    stock: 95,
    fecha_expiracion: '2026-04-18',
    laboratorio: 'AllergyCure',
    porcentaje_g: 30
  },
  {
    id: 11,
    codigo: 'MED011',
    lote: 'LOTE1K45',
    nombre: 'Diclofenaco',
    presentacion: 'Gel Tópico',
    precio_base: 14.00,
    precio_venta: 21.00,
    stock: 75,
    fecha_expiracion: '2025-11-05',
    laboratorio: 'PainFree',
    porcentaje_g: 50
  },
  {
    id: 12,
    codigo: 'MED012',
    lote: 'LOTE2L67',
    nombre: 'Acetaminofén',
    presentacion: 'Supositorios 300mg',
    precio_base: 7.00,
    precio_venta: 11.50,
    stock: 45,
    fecha_expiracion: '2026-08-01',
    laboratorio: 'KidsCare',
    porcentaje_g: 65
  },
  {
    id: 13,
    codigo: 'MED013',
    lote: 'LOTE3M89',
    nombre: 'Atorvastatina',
    presentacion: 'Tabletas 10mg',
    precio_base: 32.00,
    precio_venta: 48.00,
    stock: 150,
    fecha_expiracion: '2027-01-10',
    laboratorio: 'CardioPlus',
    porcentaje_g: 50
  },
  {
    id: 14,
    codigo: 'MED014',
    lote: 'LOTE4N01',
    nombre: 'Furosemida',
    presentacion: 'Tabletas 40mg',
    precio_base: 10.50,
    precio_venta: 15.75,
    stock: 60,
    fecha_expiracion: '2025-12-24',
    laboratorio: 'Diuretik',
    porcentaje_g: 40
  },
  {
    id: 15,
    codigo: 'MED015',
    lote: 'LOTE5O23',
    nombre: 'Cefalexina',
    presentacion: 'Suspensión 250mg/5ml',
    precio_base: 19.50,
    precio_venta: 29.25,
    stock: 70,
    fecha_expiracion: '2026-05-12',
    laboratorio: 'InfectOut',
    porcentaje_g: 50
  },
  {
    id: 16,
    codigo: 'MED016',
    lote: 'LOTE6P45',
    nombre: 'Glibenclamida',
    presentacion: 'Tabletas 5mg',
    precio_base: 8.50,
    precio_venta: 12.75,
    stock: 110,
    fecha_expiracion: '2025-09-01',
    laboratorio: 'Diabetech',
    porcentaje_g: 30
  },
  {
    id: 17,
    codigo: 'MED017',
    lote: 'LOTE7Q67',
    nombre: 'Sertralina',
    presentacion: 'Tabletas 100mg',
    precio_base: 40.00,
    precio_venta: 60.00,
    stock: 50,
    fecha_expiracion: '2026-07-20',
    laboratorio: 'NeuroCorp',
    porcentaje_g: 50
  },
  {
    id: 18,
    codigo: 'MED018',
    lote: 'LOTE8R89',
    nombre: 'Hidrocortisona',
    presentacion: 'Crema 1%',
    precio_base: 16.00,
    precio_venta: 25.60,
    stock: 90,
    fecha_expiracion: '2027-03-01',
    laboratorio: 'DermoCares',
    porcentaje_g: 60
  },
  {
    id: 19,
    codigo: 'MED019',
    lote: 'LOTE9S01',
    nombre: 'Ranitidina',
    presentacion: 'Tabletas 150mg',
    precio_base: 13.50,
    precio_venta: 20.25,
    stock: 130,
    fecha_expiracion: '2025-10-15',
    laboratorio: 'GastroLab',
    porcentaje_g: 50
  },
  {
    id: 20,
    codigo: 'MED020',
    lote: 'LOTE0T23',
    nombre: 'Vacuna Antigripal',
    presentacion: 'Jeringa Prellenada',
    precio_base: 80.00,
    precio_venta: 120.00,
    stock: 25,
    fecha_expiracion: '2026-01-31',
    laboratorio: 'VaxCorp',
    porcentaje_g: 50
  }

];

const laboratoriosMock = [
  { id: 1, nombre: 'Lab Farma', direccion: 'Av. Principal 123' },
  { id: 2, nombre: 'Lab Salud', direccion: 'Calle Secundaria 456' }
];

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  

  useEffect(() => {
    // Simular carga de datos
      setProductos(productosMock);
      setLaboratorios(laboratoriosMock);
    
  }, []);

  const agregarProducto = (nuevoProducto) => {
    const id = Math.max(...productos.map(p => p.id)) + 1;
    setProductos(prev => [...prev, { ...nuevoProducto, id }]);
  };

  const actualizarProducto = (id, datosActualizados) => {
    setProductos(prev => prev.map(p => 
      p.id === id ? { ...p, ...datosActualizados } : p
    ));
  };

  const eliminarProducto = (id) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const agregarLaboratorio = (nuevoLab) => {
    const id = Math.max(...laboratorios.map(l => l.id)) + 1;
    setLaboratorios(prev => [...prev, { ...nuevoLab, id }]);
  };

  return {
    productos,
    laboratorios,

    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    agregarLaboratorio
  };
};