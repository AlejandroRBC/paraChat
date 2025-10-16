import { 
  TextInput, 
  Button, 
  Stack,
  Group
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
      empresa: '',
      contacto: '',
      telefono: '',
      email: '',
    },
    validate: {
      empresa: (value) => !value ? 'Empresa es requerida' : null,
      contacto: (value) => !value ? 'Contacto es requerido' : null,
    },
  });

  useEffect(() => {
    if (proveedor) {
      form.setValues(proveedor);
    } else {
      form.reset();
    }
  }, [proveedor]);

  const handleSubmit = (values) => {
    onGuardar(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={isMobile ? "sm" : "md"}>
        <TextInput
          label="Empresa"
          placeholder="Nombre de la empresa"
          size={isMobile ? "sm" : "md"}
          required
          {...form.getInputProps('empresa')}
        />
        
        <TextInput
          label="Contacto"
          placeholder="Persona de contacto"
          size={isMobile ? "sm" : "md"}
          required
          {...form.getInputProps('contacto')}
        />
        
        <TextInput
          label="Email"
          placeholder="proveedor@empresa.com"
          size={isMobile ? "sm" : "md"}
          {...form.getInputProps('email')}
        />

        <TextInput
          label="Teléfono"
          placeholder="123 456 789"
          size={isMobile ? "sm" : "md"}
          {...form.getInputProps('telefono')}
        />

        <Group justify="flex-end" mt="md">
          <Button 
            type="submit" 
            size={isMobile ? "sm" : "md"}
            fullWidth={isMobile}
          >
            {proveedor ? 'Actualizar Proveedor' : 'Crear Proveedor'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}