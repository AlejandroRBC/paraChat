import { 
  IconBell,
  IconShoppingCart,
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

          
        </Flex>

        {/* Barra de búsqueda centrada */}
        <Flex
          justify="center"
          mb="xl"
        >
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <Buscador
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={setBusqueda} 
              results={resultadosParaBuscador}
              onResultSelect={handleResultSelect} 
            />
          </div>
        </Flex>

        
        {/* Switch para mostrar productos sin stock */}
        {mostrarSinStock && (
            <Badge color="red" variant="light">
              {productosFiltrados.length} productos sin stock
            </Badge>
        )}
        <Flex gap="md"  justify="space-between">
          <Switch
            checked={mostrarSinStock}
            onChange={(event) => setMostrarSinStock(event.currentTarget.checked)}
            color="red"
            size="md"
            label={
              <Text size="sm" fw={500}>
                {mostrarSinStock ? "" : ""}
              </Text>
            }
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
        <Flex
          gap="lg"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
          p="md"
        >
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