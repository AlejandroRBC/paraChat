import { 
  TextInput, 
  NumberInput,
  Button, 
  Stack,
  Group,
  Alert,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';

export function ClienteForm({ 
  cliente, 
  onGuardar,
  isMobile = false,
  clientes = []
}) {
  const [clienteReactivar, setClienteReactivar] = useState(null);

  const form = useForm({
    initialValues: {
      nombre: '',
      ci_nit: '',
      descuento: 0,
    },
    validate: {
      nombre: (value) => {
        if (!value) return 'Nombre es requerido';
        if (value.length < 2) return 'Nombre debe tener al menos 2 caracteres';
        if (value.length > 100) return 'Nombre muy largo (máx. 100 caracteres)';
        return null;
      },
      ci_nit: (value) => {
        if (!value) return 'CI/NIT es requerido';
        if (value.length < 3) return 'CI/NIT debe tener al menos 3 caracteres';
        if (value.length > 20) return 'CI/NIT muy largo (máx. 20 caracteres)';
        if (!/^[0-9a-zA-Z]+$/.test(value)) return 'Solo se permiten números y letras';
        
        // Validar que no exista un cliente ACTIVO con el mismo CI/NIT
        if (clientes && clientes.length > 0) {
          const clienteExistente = clientes.find(cli => 
            cli.ci_nit === value && 
            cli.estado === 'activo' &&
            cli.cod_cli !== (cliente?.cod_cli) // Excluir el cliente actual si está editando
          );
          
          if (clienteExistente) {
            return 'Ya existe un cliente ACTIVO con este CI/NIT';
          }
        }
        
        return null;
      },
      descuento: (value) => {
        if (value < 0) return 'Descuento no puede ser negativo';
        if (value > 100) return 'Descuento no puede ser mayor a 100%';
        if (!Number.isFinite(value)) return 'Descuento debe ser un número válido';
        return null;
      },
    },
  });

  useEffect(() => {
    if (cliente) {
      form.setValues({
        nombre: cliente.nombre || '',
        ci_nit: cliente.ci_nit || '',
        descuento: cliente.descuento || 0,
      });
      setClienteReactivar(null);
    } else {
      form.reset();
    }
  }, [cliente]);

  // Verificar si hay cliente para reactivar al cambiar CI/NIT
  useEffect(() => {
    const ci_nit = form.values.ci_nit;
    if (ci_nit && clientes.length > 0 && !cliente) {
      const clienteInactivo = clientes.find(cli => 
        cli.ci_nit === ci_nit && cli.estado === 'inactivo'
      );
      
      if (clienteInactivo) {
        setClienteReactivar(clienteInactivo);
      } else {
        setClienteReactivar(null);
      }
    } else {
      setClienteReactivar(null);
    }
  }, [form.values.ci_nit, clientes, cliente]);

  const handleSubmit = (values) => {
    onGuardar(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={isMobile ? "sm" : "md"}>
        {clienteReactivar && (
          <Alert 
            variant="light" 
            color="blue" 
            title="Cliente encontrado"
            icon={<IconInfoCircle />}
          >
            Se encontró un cliente inactivo con este CI/NIT. Al guardar, se reactivará automáticamente.
          </Alert>
        )}

        <TextInput
          label="Nombre completo"
          placeholder="Ingresa el nombre del cliente"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          {...form.getInputProps('nombre')}
        />
        
        <TextInput
          label="CI / NIT"
          placeholder="123456789"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          {...form.getInputProps('ci_nit')}
        />
        
        <NumberInput
          label="Descuento (%)"
          placeholder="0"
          min={0}
          max={100}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
          rightSection={<Text size="xs" c="dimmed">%</Text>}
          {...form.getInputProps('descuento')}
        />

        <Group justify="flex-end" mt="md">
          <Button 
            type="submit" 
            size={isMobile ? "sm" : "md"}
            fullWidth={isMobile}
          >
            {clienteReactivar ? 'Reactivar Cliente' : 
             cliente ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}