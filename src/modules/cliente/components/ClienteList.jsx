import { 
  Table, 
  ScrollArea, 
  ActionIcon, 
  Group, 
  Text 
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function ClienteList({ 
  clientes, 
  onEditar, 
  onEliminar,
  isMobile = false 
}) {
  const filas = clientes.map((cliente) => (
    <Table.Tr key={cliente.id}>
      <Table.Td>
        <Text fw={500} size={isMobile ? "xs" : "sm"}>{cliente.nombre}</Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>{cliente.email}</Text>
      </Table.Td>
      <Table.Td>
        <Text size={isMobile ? "xs" : "sm"}>{cliente.telefono}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon 
            variant="light" 
            color="yellow" 
            size={isMobile ? "sm" : "md"}
            onClick={() => onEditar(cliente)}
          >
            <IconEdit size={isMobile ? 12 : 16} />
          </ActionIcon>
          <ActionIcon 
            variant="light" 
            color="red"
            size={isMobile ? "sm" : "md"}
            onClick={() => onEliminar(cliente.id)}
          >
            <IconTrash size={isMobile ? 12 : 16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table verticalSpacing={isMobile ? "xs" : "sm"} fontSize={isMobile ? "xs" : "sm"}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Teléfono</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filas.length > 0 ? filas : (
            <Table.Tr>
              <Table.Td colSpan={4} style={{ textAlign: 'center' }}>
                <Text c="dimmed" py="xl" size={isMobile ? "xs" : "sm"}>
                  No hay clientes registrados
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}