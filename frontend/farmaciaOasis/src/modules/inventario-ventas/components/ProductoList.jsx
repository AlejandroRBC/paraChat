import { 
    IconShoppingCartPlus,
    IconEdit,
    IconTrash,
    IconArrowBackUp
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
onReactivar,
onDesactivar,
mostrarDesactivados = false 
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
            <Table.Td>
                Bs {producto.precio_base?.toFixed(2)}
            </Table.Td>
            <Table.Td>
                Bs {producto.precio_venta?.toFixed(2)}
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
            <Table.Td>{producto.porcentaje_g}%</Table.Td>
            <Table.Td >
            {/* Mostrar botón de agregar al carrito solo si NO estamos en modo "sin stock" */}
            {!mostrarDesactivados && (
                <ActionIcon 
                variant="subtle" 
                color="green" 
                size="xl" 
                onClick={() => {
                    if (producto.stock <= 0) {
                        alert('Producto sin stock disponible');
                        return;
                    }
                    onAgregarCarrito(producto);
                    }}
                    disabled={producto.stock <= 0}
                >
                    <IconShoppingCartPlus size={20} />
                </ActionIcon>
            )}
            
            {/* Mostrar botón de reactivar cuando estamos en modo desactivados */}
            {mostrarDesactivados && (
                <ActionIcon 
                variant="subtle" 
                color="orange" 
                size="xl" 
                onClick={() => {
                    onReactivar(producto.id);
                }}
                >
                <IconArrowBackUp size={20} />
                </ActionIcon>
            )}
            
            {/* Botón de editar - siempre visible */}
            {!mostrarDesactivados && (
                <ActionIcon 
                variant="subtle" 
                color="yellow" 
                size="xl" 
                onClick={() => onEditar(producto)}
            >
                <IconEdit size={20}/>
            </ActionIcon>
            )}
            {/* Mostrar botón de desactivar solo en modo activado */}
            {!mostrarDesactivados && (
                <ActionIcon 
                variant="subtle" 
                color="red" 
                size="xl" 
                onClick={() => onDesactivar(producto)} // ← Cambiar a llamar al modal
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
    <Box className="top-productos-content">
    <ScrollArea h={250}  scrollbarSize={20} scrollHideDelay={500} >
        <Table 
            verticalSpacing="sm"
        >
            <Table.Thead >
            <Table.Tr >
                <Table.Th>
                        idProducto
                </Table.Th>
                <Table.Th>
                Lote
                </Table.Th>
                <Table.Th>
                Nombre
                </Table.Th>
                <Table.Th>
                Presentacion
                </Table.Th>
                <Table.Th>
                Precio Base
                </Table.Th>
                <Table.Th>
                Precio Venta
                </Table.Th>
                <Table.Th>
                Stock
                </Table.Th>
                <Table.Th>
                Fecha Expiracion
                </Table.Th>
                <Table.Th>
                Laboratorio
                </Table.Th>
                <Table.Th>
                Ganancia %
                </Table.Th>
                <Table.Th>
                Acciones
                </Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody >
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