
import { useState } from 'react';
import { 
  ScrollArea, 
  Box, 
  Group, 
  Text, 
  Button, 
  ActionIcon,
  Flex, 
  ThemeIcon,
  Badge,
  Stack,
  Modal,
  TextInput, 
  Select,
  Alert
} from '@mantine/core';
import { 
  IconPlus, 
  IconMinus, 
  IconTrash, 
  IconUser,
  IconShoppingCartExclamation,
  IconReceiptDollar,
  IconInvoice,
  IconDownload,
  IconPrinter,
  IconCheck
} from '@tabler/icons-react';
import { generarPDFVenta,
  imprimirComprobante } from '../utils/generarPDF';

function VentaForm({ 
  carrito, 
  totalVenta, 
  onModificarCantidad, 
  onEliminarItem, 
  onVaciarCarrito, 
  onRealizarVenta, 
  onCancel 
}) {
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [datosVentaConfirmada, setDatosVentaConfirmada] = useState(null);
  const [numeroVentaGenerado, setNumeroVentaGenerado] = useState('');
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    ci_nit: '',
    metodo_pago: 'efectivo'
  });

  const handleChange = (name, value) => {
    setDatosCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    const numeroVenta = `V${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;
    setNumeroVentaGenerado(numeroVenta);
    setDatosVentaConfirmada(datosCliente);
    onRealizarVenta(datosCliente);
    setModalExitoAbierto(true);
    setModalClienteAbierto(false);
    
    setDatosCliente({
      nombre: '',
      ci_nit: '',
      metodo_pago: 'efectivo'
    });
  };

  const abrirModalVenta = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    setModalClienteAbierto(true);
  };

  const handleVentaRapida = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    const numeroVenta = `V${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;
    const datosVentaRapida = {
      nombre: 'S/N',
      ci_nit: '00000',
      metodo_pago: 'efectivo'
    };
    
    setNumeroVentaGenerado(numeroVenta);
    setDatosVentaConfirmada(datosVentaRapida);
    onRealizarVenta(datosVentaRapida);
    setModalExitoAbierto(true);
  };

  const cerrarModalExito = () => {
    setModalExitoAbierto(false);
    onCancel();
  };

  if (carrito.length === 0 && !datosVentaConfirmada) {
    return (
      <Box ta="center" py="xl">
        <ActionIcon 
          variant="subtle" 
          color="blue" 
          size="xl" 
          onClick={onCancel}
        >
          <IconShoppingCartExclamation size={80} />
        </ActionIcon>
        <Text c="dimmed" mb="lg">El carrito está vacío</Text>
        <Button onClick={onCancel} variant="light">
          Continuar Comprando
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <ScrollArea flex={1} mb="md">
          <Stack gap="sm">
            {carrito.map(item => (
              <Box 
                key={item.id} 
                p="sm" 
                style={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <Group justify="space-between" mb="xs">
                  <Text fw={600} size="sm">{item.nombre}</Text>
                  <Badge color="blue" variant="light">
                    Bs {item.precio_venta}
                  </Badge>
                </Group>
                
                {item.presentacion && (
                  <Text size="xs" c="dimmed" mb="xs">
                    {item.presentacion}
                  </Text>
                )}
                
                <Group justify="space-between">
                  <Group gap="xs">
                    <ActionIcon 
                      variant="subtle" 
                      color="red" 
                      size="sm"
                      onClick={() => onModificarCantidad(item.id, -1)}
                    >
                      <IconMinus size={14} />
                    </ActionIcon>
                    
                    <Badge variant="outline" color="blue">
                      {item.cantidad}
                    </Badge>
                    
                    <ActionIcon 
                      variant="subtle" 
                      color="green" 
                      size="sm"
                      onClick={() => onModificarCantidad(item.id, 1)}
                    >
                      <IconPlus size={14} />
                    </ActionIcon>
                  </Group>
                  
                  <Group gap="xs">
                    <Text fw={600} size="sm">
                      Bs {(item.precio_venta * item.cantidad).toFixed(2)}
                    </Text>
                    <ActionIcon 
                      variant="subtle" 
                      color="red" 
                      size="sm"
                      onClick={() => onEliminarItem(item.id)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>
            ))}
          </Stack>
        </ScrollArea>

        <Box py="md" style={{ borderTop: '2px solid #e9ecef' }}>
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg">Total:</Text>
            <Text fw={700} size="xl" c="blue.6">
              Bs {totalVenta.toFixed(2)}
            </Text>
          </Group>
        </Box>

        <Stack gap>
          <Group grow>
            <Button 
              onClick={abrirModalVenta}
              size="md"
              fullWidth
            >
              <IconReceiptDollar size={16} />
              Venta
            </Button>

            <Button 
              onClick={handleVentaRapida}
              size="md"
              fullWidth
              variant="light"
            >
              <IconInvoice size={16} />
              Venta Rápida
            </Button>
          </Group>
          <Flex gap="md" justify="center" align="flex-start" direction="row" wrap="wrap">
            <Button 
              variant="light" 
              onClick={onVaciarCarrito}
              size="md"
            >
              <IconTrash size={16} />
              Vaciar
            </Button>
          </Flex>
        </Stack>
      </Box>

      {/* Modal Datos del Cliente */}
      <Modal
        opened={modalClienteAbierto}
        onClose={() => setModalClienteAbierto(false)}
        title={
          <Group gap="sm">
            <IconUser size={20} />
            <Text fw={600}>Datos del Cliente</Text>
          </Group>
        }
        size="md"
        overlayProps={{ opacity: 0.5, blur: 4 }}
        styles={{ content: { borderRadius: '12px' } }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Nombre del Cliente"
              placeholder="Ingrese nombre completo"
              value={datosCliente.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              required
            />
            
            <TextInput
              label="CI / NIT"
              placeholder="Número de identificación"
              value={datosCliente.ci_nit}
              onChange={(e) => handleChange('ci_nit', e.target.value)}
            />
            
            <Select
              label="Método de Pago"
              placeholder="Seleccione método"
              data={[
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'qr', label: 'QR' },
                { value: 'mixto', label: 'Mixto' }
              ]}
              value={datosCliente.metodo_pago}
              onChange={(value) => handleChange('metodo_pago', value)}
              required
            />

            <Group justify="space-between" mt="md">
              <Text fw={700} size="lg">Total a Pagar:</Text>
              <Text fw={700} size="xl" c="blue.6">
                Bs {totalVenta.toFixed(2)}
              </Text>
            </Group>

            <Group grow mt="md">
              <Button 
                type="submit" 
                color="green"
                size="md"
              >
                Confirmar Venta
              </Button>
              
              <Button 
                variant="light" 
                color="gray"
                onClick={() => setModalClienteAbierto(false)}
                size="md"
              >
                Cancelar
              </Button>
            </Group>
          </Stack>
        </Box>
      </Modal>

      {/* Modal Éxito y Opciones */}
      {datosVentaConfirmada && (
        <Modal
          opened={modalExitoAbierto}
          onClose={cerrarModalExito}
          title={
            <Group gap="sm">
              <IconCheck size={20} color="green" />
              <Text fw={600}>¡Venta Realizada!</Text>
            </Group>
          }
          size="md"
          centered
        >
          <Stack gap="md">
                

            <Box
              p="md"
              style={{
                border: '2px solid #1871c1',
                borderRadius: '8px',
                backgroundColor: '#f0f7ff'
              }}
            >
              <Text fw={600} mb="xs">Comprobante: #{numeroVentaGenerado}</Text>
              <Text size="sm" c="dimmed">Cliente: {datosVentaConfirmada.nombre}</Text>
              <Text size="sm" c="dimmed">Total: Bs {totalVenta.toFixed(2)}</Text>
            </Box>

            <Group grow>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={() => generarPDFVenta(datosVentaConfirmada, carrito, totalVenta, numeroVentaGenerado)}
              >
                Descargar PDF
              </Button>
              
              <Button
                leftSection={<IconPrinter size={16} />}
                variant="light"
                onClick={() => imprimirComprobante(datosVentaConfirmada, carrito, totalVenta, numeroVentaGenerado)}
              >
                Imprimir
              </Button>
            </Group>

          </Stack>
          <br/>
          <Flex
            
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Button
              onClick={cerrarModalExito}
              variant="light"
            >
              Continuar
            </Button>
          </Flex>


          
            
        </Modal>
      )}
    </>
  );
}

export default VentaForm;