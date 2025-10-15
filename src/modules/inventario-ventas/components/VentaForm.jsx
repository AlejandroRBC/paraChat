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
  Divider,
  Modal,
  TextInput, Select
} from '@mantine/core';
import { IconPlus, 
  IconMinus, 
  IconTrash, 
  IconUser,
  IconShoppingCartExclamation,
  IconReceiptDollar,
  IconInvoice,
  IconCancel } from '@tabler/icons-react';

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
    onRealizarVenta(datosCliente);
    setModalClienteAbierto(false);
    // Resetear datos del cliente después de la venta
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
    // Lógica para venta rápida (sin datos de cliente)
    const datosVentaRapida = {
      nombre: 'S/N',
      ci_nit: '00000',
      metodo_pago: 'efectivo'
    };
    onRealizarVenta(datosVentaRapida);
  };

  if (carrito.length === 0) {
    return (
      <Box ta="center" py="xl">
          <ActionIcon 
            variant="subtle" 
            color="blue" 
            size="xl" 
            onClick={onCancel}
          >
            <IconShoppingCartExclamation size ={80}/>
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
        {/* Lista de productos en el carrito */}
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

        {/* Total */}
        <Box py="md" style={{ borderTop: '2px solid #e9ecef' }}>
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg">Total:</Text>
            <Text fw={700} size="xl" c="blue.6">
              Bs {totalVenta.toFixed(2)}
            </Text>
          </Group>
        </Box>

        {/* Botones de acción */}
        <Stack gap>
          <Group grow>
          <Button 
            onClick={abrirModalVenta}
            size="md"
            fullWidth
          >
            <IconReceiptDollar/>
            Venta
          </Button>

          <Button 
            onClick={handleVentaRapida}
            size="md"
            fullWidth
            variant="light"
          >
            <IconInvoice/>
            Venta Rápida
          </Button>

          </Group>
           <Flex
            gap="md"
            justify="center"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            <Button 
              variant="light" 
              onClick={onVaciarCarrito}
              size="md"
            >
              <IconTrash/> Vaciar
            </Button>
          </Flex>
          <Group grow>
            
          </Group>
        </Stack>
      </Box>

      {/* Modal para datos del cliente */}
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
        styles={{
          content: {
            borderRadius: '12px',
          }
        }}
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
    </>
  );
}




export default VentaForm;