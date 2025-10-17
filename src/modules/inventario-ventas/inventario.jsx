import { 
  IconBell,
  IconTrashOff,
  IconShoppingCart,
  IconTrashX,
  IconShoppingCartFilled,
  IconX
} from '@tabler/icons-react';
import { 
  ThemeIcon,
  Stack,
  Switch,
  Badge,
  Text,
  Container,
  Flex,
  ActionIcon,
  Button,
  Space,
  Group,
  Drawer,
  AppShell
} from '@mantine/core';
import { useState } from 'react';
import { useProductos } from './hooks/useProductos';
import { useCarrito } from './hooks/useCarrito';
import { useModales } from './hooks/useModales'; 

import { Buscador  } from "./../global/components/buscador/Buscador";
import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import LaboratorioForm from './components/LaboratorioForm';
import VentaForm from './components/VentaForm';
import Modal from '../global/components/modal/Modal.jsx';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";




function Inventario() {
  const {
    productos,
    laboratorios,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    agregarLaboratorio
  } = useProductos();

  const {
    carrito,
    agregarAlCarrito,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalVenta
  } = useCarrito();

  const {
    modalProducto,
    modalLaboratorio,
    abrirModalProducto,
    cerrarModalProducto,
    abrirModalLaboratorio,
    cerrarModalLaboratorio,
    
  } = useModales();
  
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [mostrarSinStock, setMostrarSinStock] = useState(false); // Nuevo estado para el switch

  const handleRealizarVenta = (datosCliente) => {
    console.log('Venta realizada:', { datosCliente, carrito, totalVenta });
  };

  const handleSubmitProducto = (datos) => {
    if (modalProducto.producto) {
      actualizarProducto(modalProducto.producto.id, datos);
    } else {
      agregarProducto(datos);
    }
    cerrarModalProducto();
  };

  const [busqueda, setBusqueda] = useState('');
  
  // Filtrar productos basado en búsqueda y estado del switch
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      p.codigo.includes(busqueda.toUpperCase());
    
    // Si el switch está activado, mostrar solo productos con stock <= 0
    if (mostrarSinStock) {
      return coincideBusqueda && p.stock <= 0;
    }
    
    // Si no, mostrar todos los productos que coincidan con la búsqueda
    return coincideBusqueda;
  });
  
  const resultadosParaBuscador = productosFiltrados.map(p => ({
    id: p.id,
    codigo: p.codigo.toUpperCase(),
    name: p.nombre, 
    value: p.precio_venta,
    label: p.laboratorio, 
  }));
  
  const handleResultSelect = (result) => {
    console.log("hola mundo", result);
  };
  
  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
  // Reporte excel
  const generarReporteExcel = async () => {
    // Filtrar productos con stock > 0
    const productosConStock = productosFiltrados.filter(p => p.stock > 0);

    if (!productosConStock || productosConStock.length === 0) {
      alert("No hay productos con stock para generar el reporte.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventario");

    // Título
    worksheet.mergeCells("A1:K1");
    const titulo = worksheet.getCell("A1");
    titulo.value = "Reporte de Inventario";
    titulo.font = { bold: true, size: 16 };
    titulo.alignment = { horizontal: "center" };

    // Encabezados
    worksheet.addRow([]);
    const encabezados = [
      "N°",
      "Código",
      "Lote",
      "Nombre",
      "Presentación",
      "Precio Base (Bs)",
      "Precio Venta (Bs)",
      "Stock",
      "Fecha de Expiración",
      "Laboratorio",
      "% Ganancia"
    ];
    const headerRow = worksheet.addRow(encabezados);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "70E2FA" } 
      };
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Filas de datos
    productosConStock.forEach((p, i) => {
      const row = worksheet.addRow([
        i + 1,
        p.codigo,
        p.lote,
        p.nombre,
        p.presentacion,
        p.precio_base?.toFixed(2) || "0.00",
        p.precio_venta?.toFixed(2) || "0.00",
        p.stock,
        p.fecha_expiracion,
        p.laboratorio,
        p.porcentaje_g + "%"
      ]);

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      });
    });

    // Ajustar anchos de columna
    const widths = [5, 15, 15, 25, 20, 15, 15, 10, 18, 20, 12];
    widths.forEach((w, i) => worksheet.getColumn(i + 1).width = w);

    // Guardar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fechaActual = new Date().toISOString().split("T")[0];
    saveAs(new Blob([buffer]), `reporte-inventario-${fechaActual}.xlsx`);
  };


  return (
    <>
      <Container size="100%" py="xl" px="md">
        
        {/* Header con título centrado y carrito a la derecha */}
        <Flex
          justify="space-between"
          align="center"
          mb="xl"
          gap="md"
          style={{ position: 'relative' }}
        >
          {/* Espacio vacío para balancear el flex */}
          <div style={{ width: '40px' }}></div>

          {/* Título centrado */}
          <Text 
            className="dashboard-title" 
            size="xl"
            style={{ 
              position: 'absolute', 
              left: '50%', 
              transform: 'translateX(-50%)' 
            }}
          >
            INVENTARIO
          </Text>
          <br />
          <br />

          
        </Flex>
        <br />
          <br />

        {/* Barra de búsqueda centrada */}
        <Flex
          justify="center"
          mb="xl"
        >
        </Flex>

        
        {/* Switch para mostrar productos sin stock */}
          <Flex justify="space-between" align="center" gap="md" mb="xl" wrap="wrap">
            {/* Switch a la izquierda */}
            <Switch
              checked={mostrarSinStock}
              onChange={(event) => setMostrarSinStock(event.currentTarget.checked)}
              color="red"
              size="md"
              label={
                <Text>
                  {mostrarSinStock ? 
                    <Badge size="lg" color="red" variant="light">
                      <IconTrashX size={20}/>
                    </Badge>
                    :
                    <Badge size="lg" color="gray" variant="light">
                      <IconTrashOff size={20}/>
                    </Badge>
                  }
                </Text>
              }
              
            />
            
            {/* Buscador en el centro */}
            <Buscador
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={setBusqueda} 
              results={resultadosParaBuscador}
              onResultSelect={handleResultSelect}
              style={{ width: '500px', marginLeft: '-80px' }}
            />
            
            {/* Carrito alineado a la derecha */}
            <ActionIcon 
              variant="subtle" 
              color="blue" 
              size="xl" 
              onClick={() => setSidebarAbierto(true)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <IconShoppingCart size={32} />
              {cantidadCarrito > 0 && (
                <Badge 
                  size="sm" 
                  circle 
                  color="red"
                  style={{ 
                    position: 'absolute', 
                    top: 2, 
                    right: 2,
                  }}
                >
                  {cantidadCarrito}
                </Badge>
              )}
            </ActionIcon>
          </Flex>
                  
        {/* Tabla de productos */}
        <ProductoList 
          productos={productosFiltrados}
          onAgregarCarrito={agregarAlCarrito}
          onEditar={abrirModalProducto} 
          onEliminar={eliminarProducto}
          mostrarSinStock={mostrarSinStock} // Pasar el estado al componente
        />
        
        {/* Botones de acción */}
        <br />
        <Flex
          gap="lg"
          justify="center"
          align="center"
          direction="column" 
          wrap="wrap"
          p="md"
        >
          <Flex gap="lg" justify="center" align="center">
            <Button 
              size="md"
              variant="light"
              onClick={() => abrirModalProducto()}
            >
              Registrar Nuevo Producto
            </Button>
            
            <Button 
              size="md" 
              variant="light"
              onClick={abrirModalLaboratorio}
            >
              Registrar Nuevo Laboratorio
            </Button>
          </Flex>

          <Flex mt="md" justify="center">
            <Button 
              size="md" 
              variant="light"
              onClick={generarReporteExcel}
            >
              Generar Reporte Excel
            </Button>
          </Flex>
        </Flex>


        {/* Modal Agregar/Editar Producto */}
        {modalProducto.abierto && (
          <Modal 
            titulo={modalProducto.producto ? "Editar Producto" : "Agregar Nuevo Producto"}
            onClose={cerrarModalProducto}
          >
            <ProductoForm
              laboratorios={laboratorios}
              producto={modalProducto.producto}
              onSubmit={handleSubmitProducto}
              onCancel={cerrarModalProducto}
            />
          </Modal>
        )}

        {/* Modal Agregar Laboratorio */}
        {modalLaboratorio && (
          <Modal 
            titulo="Agregar Nuevo Laboratorio"
            onClose={cerrarModalLaboratorio}
          >
            <LaboratorioForm
              onSubmit={(datosLaboratorio) => {
                agregarLaboratorio(datosLaboratorio);
                cerrarModalLaboratorio();
              }}
              onCancel={cerrarModalLaboratorio}
            />
          </Modal>
        )}
      </Container>

      {/* Sidebar del Carrito */}
      <Drawer
        opened={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
        position="right"
        size="md"
        padding="md"
      >
        <Flex justify="space-between" align="center" mb="lg">
          <ThemeIcon size="xl" variant="light">
            <IconShoppingCartFilled/>  
          </ThemeIcon>
            <Text>
              Carrito de Compras
            </Text>
        </Flex>
        
        <VentaForm
          carrito={carrito}
          totalVenta={totalVenta}
          onModificarCantidad={modificarCantidad}
          onEliminarItem={eliminarDelCarrito}
          onVaciarCarrito={vaciarCarrito}
          onRealizarVenta={handleRealizarVenta}
          onCancel={() => setSidebarAbierto(false)}
          
        />
      </Drawer>
    </>
  );
}

export default Inventario;