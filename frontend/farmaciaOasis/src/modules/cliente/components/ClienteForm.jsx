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
import { IconInfoCircle, IconLock } from '@tabler/icons-react';

export function ClienteForm({ 
  cliente, 
  onGuardar,
  isMobile = false,
  clientes = []
}) {
  const [clienteReactivar, setClienteReactivar] = useState(null);
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});

  const form = useForm({
    initialValues: {
      nombre: '',
      ci_nit: '',
      descuento: 0,
    }
  });

  // Función para verificar si el formulario es válido
  const esFormularioValido = () => {
    const { nombre, ci_nit, descuento } = form.values;
    
    // Campos obligatorios no vacíos
    if (!nombre.trim() || !ci_nit.trim()) {
      return false;
    }
    
    // Sin errores de validación
    if (Object.keys(errores).length > 0) {
      return false;
    }
    
    // Longitudes mínimas
    if (nombre.length < 2 || ci_nit.length < 3) {
      return false;
    }
    
    // Validar formato CI/NIT (solo números y letras)
    if (!/^[0-9a-zA-Z]+$/.test(ci_nit)) {
      return false;
    }
    
    // Validar descuento
    if (descuento < 0 || descuento > 100 || !Number.isFinite(descuento)) {
      return false;
    }
    
    return true;
  };

  // Función de validación manual
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };
    
    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          nuevosErrores.nombre = 'El nombre es requerido';
        } else if (valor.length < 2) {
          nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (valor.length > 100) {
          nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
        } else {
          delete nuevosErrores.nombre;
        }
        break;

      case 'ci_nit':
        if (!valor.trim()) {
          nuevosErrores.ci_nit = 'El CI/NIT es requerido';
        } else if (valor.length < 3) {
          nuevosErrores.ci_nit = 'El CI/NIT debe tener al menos 3 caracteres';
        } else if (valor.length > 20) {
          nuevosErrores.ci_nit = 'El CI/NIT no puede tener más de 20 caracteres';
        } else if (!/^[0-9a-zA-Z]+$/.test(valor)) {
          nuevosErrores.ci_nit = 'Solo se permiten números y letras';
        } else {
          // Validar que no exista un cliente ACTIVO con el mismo CI/NIT
          if (clientes && clientes.length > 0) {
            const clienteExistente = clientes.find(cli => 
              cli.ci_nit === valor && 
              cli.estado === 'activo' &&
              cli.cod_cli !== (cliente?.cod_cli) // Excluir el cliente actual si está editando
            );
            
            if (clienteExistente) {
              nuevosErrores.ci_nit = 'Ya existe un cliente ACTIVO con este CI/NIT';
            } else {
              delete nuevosErrores.ci_nit;
            }
          } else {
            delete nuevosErrores.ci_nit;
          }
        }
        break;

      case 'descuento':
        if (valor < 0) {
          nuevosErrores.descuento = 'El descuento no puede ser negativo';
        } else if (valor > 100) {
          nuevosErrores.descuento = 'El descuento no puede ser mayor a 100%';
        } else if (!Number.isFinite(valor)) {
          nuevosErrores.descuento = 'El descuento debe ser un número válido';
        } else {
          delete nuevosErrores.descuento;
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (name, value) => {
    form.setFieldValue(name, value);

    if (tocado[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (name, value) => {
    setTocado(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  const validarFormulario = () => {
    const nuevosTocados = {};
    Object.keys(form.values).forEach(key => {
      nuevosTocados[key] = true;
    });
    setTocado(nuevosTocados);

    Object.keys(form.values).forEach(key => {
      validarCampo(key, form.values[key]);
    });

    return Object.keys(errores).length === 0 && esFormularioValido();
  };

  useEffect(() => {
    if (cliente) {
      form.setValues({
        nombre: cliente.nombre || '',
        ci_nit: cliente.ci_nit || '',
        descuento: cliente.descuento || 0,
      });
      setClienteReactivar(null);
      setErrores({});
      setTocado({});
    } else {
      form.reset();
      setErrores({});
      setTocado({});
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    onGuardar(form.values);
    form.reset();
    setErrores({});
    setTocado({});
    setClienteReactivar(null);
  };

  const hayErrores = Object.keys(errores).length > 0;
  const formularioValido = esFormularioValido();

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={isMobile ? "sm" : "md"}>
        {hayErrores && (
          <Alert 
            icon={<IconInfoCircle size={16} />} 
            title="Errores de validación" 
            color="red" 
            mb="md"
          >
            Por favor corrige los errores en el formulario antes de enviar.
          </Alert>
        )}

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
          value={form.values.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          onBlur={(e) => handleBlur('nombre', e.target.value)}
          error={errores.nombre}
        />
        
        <TextInput
          label="CI / NIT"
          placeholder="123456789"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
          value={form.values.ci_nit}
          onChange={(e) => handleChange('ci_nit', e.target.value)}
          onBlur={(e) => handleBlur('ci_nit', e.target.value)}
          error={errores.ci_nit}
        />
        
        <NumberInput
          label="Descuento (%)"
          placeholder="0"
          min={0}
          max={100}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
          value={form.values.descuento}
          onChange={(value) => handleChange('descuento', value)}
          onBlur={() => handleBlur('descuento', form.values.descuento)}
          error={errores.descuento}
          rightSection={<Text size="xs" c="dimmed">%</Text>}
        />

        <Group justify="flex-end" mt="md">
          <Button 
            type="submit" 
            size={isMobile ? "sm" : "md"}
            fullWidth={isMobile}
            disabled={!formularioValido}
            leftSection={!formularioValido ? <IconLock size={16} /> : null}
          >
            {clienteReactivar ? 'Reactivar Cliente' : 
             cliente ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}