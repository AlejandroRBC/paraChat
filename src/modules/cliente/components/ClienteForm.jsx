import { 
  TextInput, 
  Button, 
  Stack,
  Group
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

export function ClienteForm({ 
  cliente, 
  onGuardar,
  isMobile = false 
}) {
  const form = useForm({
    initialValues: {
      nombre: '',
      email: '',
      telefono: '',
    },
    validate: {
      nombre: (value) => !value ? 'Nombre es requerido' : null,
      email: (value) => !value ? 'Email es requerido' : null,
    },
  });

  useEffect(() => {
    if (cliente) {
      form.setValues(cliente);
    } else {
      form.reset();
    }
  }, [cliente]);

  const handleSubmit = (values) => {
    onGuardar(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={isMobile ? "sm" : "md"}>
        <TextInput
          label="Nombre completo"
          placeholder="Ingresa el nombre del cliente"
          size={isMobile ? "sm" : "md"}
          required
          {...form.getInputProps('nombre')}
        />
        
        <TextInput
          label="Email"
          placeholder="cliente@ejemplo.com"
          size={isMobile ? "sm" : "md"}
          required
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
            {cliente ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}