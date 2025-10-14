
import { useVentas } from './hooks/useVentas';

import VentasList from './components/VentasList';
import './historial-ventas.css';



function HistorialVentas() {
  
  //llamar  al hook useVentas que simula la interaciion con la api
  const { ventas, error} = useVentas();

  //del hook se trajo error para mostrar como mensaje
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
  
    <VentasList 
      ventas={ventas}
    />
  
  );
}

export default HistorialVentas;