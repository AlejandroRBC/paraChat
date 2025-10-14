import { 
        IconShoppingCartPlus,
        IconEdit,
        IconTrash
    } from '@tabler/icons-react';
import { Modal,
    Button,
    ThemeIcon,
    Table,
    Badge,
    Paper,
    Title, 
    Alert, 
    ScrollArea, 
    Box, 
    ActionIcon } from '@mantine/core';

function ProductoList({ 
    productos,
    onAgregarCarrito, 
    onEditar, 
    onEliminar }) {
    
    const getBadgeColor = (metodo) => {
        
        if (metodo <= 10 ) {
            return '#FF0000';
        }
        if (metodo > 10 && metodo < 30) {
            return '#FF8000';
        }
        if (metodo >= 30 ) {
            return '#28a745';
        }
        return'#6c757d';
        };
    if (productos.length === 0) {
        return (
            <div >
                <p>No hay productos registrados.</p>
            </div>
        );
    }
    const filas = productos.map((producto) => {
        return (

            <Table.Tr 
                key={producto.id} 
                className="mantine-Table-tr" 
                withTableBorder
            >
                <Table.Td className="mantine-Table-td">
                {producto.codigo}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.lote}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.nombre}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.presentacion}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.precio_base}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.precio_venta}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                <Badge 
                    color={getBadgeColor(producto.stock)}
                    size="sm"
                >
                {producto.stock}
                </Badge>
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.fecha_expiracion}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.laboratorio}
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                {producto.porcentaje_g} %
                </Table.Td>
                <Table.Td className="mantine-Table-td">
                <ActionIcon 
                    variant="subtle" 
                    color="green" 
                    size="xl" 
                    onClick={() => onAgregarCarrito(producto)}
                >
                    
                    <IconShoppingCartPlus size={20} />
                </ActionIcon>
                <ActionIcon 
                    variant="subtle" 
                    color="yellow" 
                    size="xl" 
                    onClick={() => onEditar(producto)}
                >
                    <IconEdit size={20}/>
                </ActionIcon>
                    <ActionIcon 
                    variant="subtle" 
                    color="red" 
                    size="xl" 
                    onClick={() => {
                        if (window.confirm(`¿Eliminar ${producto.nombre}?`)) {
                            onEliminar(producto.id);
                        }
                    }}
                >
                    <IconTrash size={20}/>
                </ActionIcon>
                </Table.Td>
            </Table.Tr>
            );
        });
    return (

        <Paper 
            
        >
        <Box className="top-productos-content">
        <ScrollArea h={250}  scrollbarSize={20} scrollHideDelay={500} >
            <Table 
                className="mantine-Table-table"
                verticalSpacing="sm"
            >
                <Table.Thead className="mantine-Table-thead">
                <Table.Tr className="mantine-Table-tr">
                    <Table.Th className="mantine-Table-th">
                            idProducto
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Lote
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Nombre
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Presentacion
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Precio Base
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Precio Venta
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Stock
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Fecha Expiracion
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Laboratorio
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Ganancia %
                    </Table.Th>
                    <Table.Th className="mantine-Table-th">
                    Acciones
                    </Table.Th>
                </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="mantine-Table-tbody">
                {filas}
                </Table.Tbody>
            </Table>
        </ScrollArea>
        </Box>
    
        {productos.length === 0 && (<p>No hay productos disponibles</p>)}

        </Paper>
    );
}

export default ProductoList;