import { 
  TextInput, 
  NumberInput,
  Button, 
  Stack,
  Group,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

export function ProveedorForm({ 
  proveedor, 
  onGuardar,
  isMobile = false
}) {
  const form = useForm({
    initialValues: {
      nombre: '',
      telefono: '',
      cantidad: 0,
      concepto: '',
      precio_unitario: 0,
      precio_total: 0,
    },
    validate: {
      nombre: (value) => {
        if (!value) return 'Nombre es requerido';
        if (value.length < 2) return 'Nombre debe tener al menos 2 caracteres';
        if (value.length > 100) return 'Nombre muy largo (máx. 100 caracteres)';
        return null;
      },
      telefono: (value) => {
        if (!value) return 'Teléfono es requerido';
        if (value.length < 6) return 'Teléfono debe tener al menos 6 caracteres';
        if (value.length > 20) return 'Teléfono muy largo (máx. 20 caracteres)';
        return null;
      },
      cantidad: (value) => {
        if (value < 0) return 'Cantidad no puede ser negativa';
        if (!Number.isInteger(Number(value))) return 'Cantidad debe ser un número entero';
        return null;
      },
      concepto: (value) => {
        if (!value) return 'Concepto es requerido';
        if (value.length < 3) return 'Concepto debe tener al menos 3 caracteres';
        return null;
      },
      precio_unitario: (value) => {
        if (value < 0) return 'Precio unitario no puede ser negativo';
        if (!Number.isFinite(value)) return 'Precio unitario debe ser un número válido';
        return null;
      },
      precio_total: (value) => {
        if (value < 0) return 'Precio total no puede ser negativo';
        if (!Number.isFinite(value)) return 'Precio total debe ser un número válido';
        return null;
      },
    },
  });

  useEffect(() => {
    if (proveedor) {
      form.setValues({
        nombre: proveedor.nombre || '',
        telefono: proveedor.telefono || '',
        cantidad: proveedor.cantidad || 0,
        concepto: proveedor.concepto || '',
        precio_unitario: proveedor.precio_unitario || 0,
        precio_total: proveedor.precio_total || 0,
      });
    } else {
      form.reset();
    }
  }, [proveedor]);

  // Calcular precio_total automáticamente cuando cambia cantidad o precio_unitario
  useEffect(() => {
    const cantidad = form.values.cantidad;
    const precio_unitario = form.values.precio_unitario;
    const precio_total = cantidad * precio_unitario;
    
    if (!isNaN(precio_total) && isFinite(precio_total)) {
      form.setFieldValue('precio_total', parseFloat(precio_total.toFixed(2)));
    }
  }, [form.values.cantidad, form.values.precio_unitario]);

  const handleSubmit = (values) => {
    onGuardar(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={isMobile ? "sm" : "md"}>

        <TextInput
          label="Nombre del proveedor"
          placeholder="Ingresa el nombre del proveedor"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          {...form.getInputProps('nombre')}
        />
        
        <TextInput
          label="Teléfono"
          placeholder="123456789"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          {...form.getInputProps('telefono')}
        />

        <NumberInput
          label="Cantidad"
          placeholder="0"
          min={0}
          size={isMobile ? "sm" : "md"}
          {...form.getInputProps('cantidad')}
        />

        <TextInput
          label="Concepto"
          placeholder="Descripción del producto/servicio"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          {...form.getInputProps('concepto')}
        />

        <NumberInput
          label="Precio Unitario"
          placeholder="0.00"
          min={0}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
          {...form.getInputProps('precio_unitario')}
        />

        <NumberInput
          label="Precio Total"
          placeholder="0.00"
          min={0}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
          readOnly
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
          {...form.getInputProps('precio_total')}
        />

        <Group justify="flex-end" mt="md">
          <Button 
            type="submit" 
            size={isMobile ? "sm" : "md"}
            fullWidth={isMobile}
          >
            {proveedor ? 'Modificar' : 'Agregar'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}