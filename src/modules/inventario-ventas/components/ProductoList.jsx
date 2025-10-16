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
onEliminar,
mostrarSinStock = false // Nuevo prop para controlar qué botones mostrar
}) {

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
            withTableBorder
        >
            <Table.Td >
            {producto.codigo}
            </Table.Td>
            <Table.Td >
            {producto.lote}
            </Table.Td>
            <Table.Td >
            {producto.nombre}
            </Table.Td>
            <Table.Td >
            {producto.presentacion}
            </Table.Td>
            <Table.Td >
            {producto.precio_base}
            </Table.Td>
            <Table.Td >
            {producto.precio_venta}
            </Table.Td>
            <Table.Td >
            <Badge 
                color={getBadgeColor(producto.stock)}
                size="sm"
            >
            {producto.stock}
            </Badge>
            </Table.Td>
            <Table.Td >
            {producto.fecha_expiracion}
            </Table.Td>
            <Table.Td >
            {producto.laboratorio}
            </Table.Td>
            <Table.Td >
            {producto.porcentaje_g} %
            </Table.Td>
            <Table.Td >
            {/* Mostrar botón de agregar al carrito solo si NO estamos en modo "sin stock" */}
            {!mostrarSinStock && (
                <ActionIcon 
                    variant="subtle" 
                    color="green" 
                    size="xl" 
                    onClick={() => onAgregarCarrito(producto)}
                >
                    <IconShoppingCartPlus size={20} />
                </ActionIcon>
            )}
            
            {/* Botón de editar - siempre visible */}
            <ActionIcon 
                variant="subtle" 
                color="yellow" 
                size="xl" 
                onClick={() => onEditar(producto)}
            >
                <IconEdit size={20}/>
            </ActionIcon>
            
            {/* Mostrar botón de eliminar solo si NO estamos en modo "sin stock" */}
            {!mostrarSinStock && (
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
            )}
            </Table.Td>
        </Table.Tr>
        );
    });
return (

    <Paper 
        
    >
    <Box >
    <ScrollArea h={250}  scrollbarSize={20} scrollHideDelay={500} >
        <Table 
            verticalSpacing="sm"
        >
            <Table.Thead >
            <Table.Tr >
                <Table.Th >
                        idProducto
                </Table.Th>
                <Table.Th >
                Lote
                </Table.Th>
                <Table.Th >
                Nombre
                </Table.Th>
                <Table.Th >
                Presentacion
                </Table.Th>
                <Table.Th >
                Precio Base
                </Table.Th>
                <Table.Th >
                Precio Venta
                </Table.Th>
                <Table.Th >
                Stock
                </Table.Th>
                <Table.Th >
                Fecha Expiracion
                </Table.Th>
                <Table.Th >
                Laboratorio
                </Table.Th>
                <Table.Th >
                Ganancia %
                </Table.Th>
                <Table.Th >
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