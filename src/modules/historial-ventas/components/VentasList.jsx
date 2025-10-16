
import { IconAlertTriangle,
  IconPackage, 
  IconCheck, 
  IconX } from '@tabler/icons-react';
import { Modal,
  Table,
  Badge,
  Text, 
  Group, 
  Paper, 
  Title, 
  Alert, 
  ScrollArea, 
  Box, 
  ActionIcon } from '@mantine/core';
function VentasList({ ventas }) {
    const getBadgeColor = (metodo) => {
      const colores = {
        'efectivo': '#28a745',
        'qr': '#17a2b8',
        'mixto': '#6f42c1'
      };
      return colores[metodo.toLowerCase()] || '#6c757d';
    };
  
    if (ventas.length === 0) {
      return (
        <div className="sin-ventas">
          <p>No hay ventas registradas en el historial.</p>
        </div>
      );
    }

    /// Cargar datos en formato tabla 
    const filas = ventas.map((venta) => {
        
      return (
        <Table.Tr 
          key={venta.id} 
          className="mantine-Table-tr" 
        >
          <Table.Td className="mantine-Table-td">
            {venta.id_venta}
          </Table.Td>
          <Table.Td className="mantine-Table-td">
            {venta.fecha}
          </Table.Td>
          <Table.Td className="mantine-Table-td">
            {venta.hora}
          </Table.Td>
          <Table.Td className="mantine-Table-td">
            {venta.nombre_cliente}
          </Table.Td>
          <Table.Td className="mantine-Table-td">
            {venta.ci_nit}
          </Table.Td>
          <Table.Td className="mantine-Table-td">
          <Badge 
              color={getBadgeColor(venta.metodo_pago)} 
              variant="light" 
              size="sm"
            >
            {venta.metodo_pago}
          </Badge>
          </Table.Td>
          <Table.Td className="mantine-Table-td">
            {venta.total.toFixed(2)}
          </Table.Td>
          <Table.Td className="mantine-Table-td">
            {venta.productos}
          </Table.Td>
        
        </Table.Tr>
      );
    });
  
    return (

    <Paper 
          p="lg" 
          withBorder 
          radius="lg" 
          shadow="md"
        >


      <Box className="top-productos-content" style={{ height: '400px' }}>
        <ScrollArea 
          h={400}
          className="mantine-ScrollArea-root"
          scrollbarSize={6}
          type="auto"
        >
          <Table 
            className="mantine-Table-table"
            verticalSpacing="sm"
          >
            <Table.Thead className="mantine-Table-thead">
              <Table.Tr className="mantine-Table-tr">

                <Table.Th className="mantine-Table-th">
                  idVenta
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  Fecha
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  hora
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  cliente
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  Ci/Nit
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  metodo Pago
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  Total(Bs.)
                </Table.Th>
                <Table.Th className="mantine-Table-th">
                  productos
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody className="mantine-Table-tbody">
              {filas}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>
      </Paper>
    );
  }
  
  export default VentasList;