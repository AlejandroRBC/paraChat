// components/Header.jsx - VERSIÓN COMPLETA SIN CSS INLINE
import { useState, useEffect, useRef } from 'react';
import { 
  Group, 
  Text, 
  ActionIcon,
  Badge,
  Menu,
  Stack,
  ThemeIcon
} from '@mantine/core';
import { 
  IconBell, 
  IconAlertTriangle,
  IconCalendarExclamation
} from '@tabler/icons-react';
import '../dashboard.css'; 

function Header({ productosBajos = [], productosPorVencer = [] }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fechaHora, setFechaHora] = useState({ hora: '' });
  const audioPlayedRef = useRef(false);

  // Calcular notificaciones
  const notificacionesStock = productosBajos.filter(p => p.stock <= 5).length;
  const notificacionesVencimiento = productosPorVencer.filter(p => p.diasRestantes <= 10).length;
  const totalNotificaciones = notificacionesStock + notificacionesVencimiento;

  // Actualizar hora
  useEffect(() => {
    const actualizarFechaHora = () => {
      const ahora = new Date();
      const hora = ahora.toLocaleTimeString('es-ES');
      setFechaHora({ hora });
    };

    actualizarFechaHora();
    const intervalo = setInterval(actualizarFechaHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Efecto para sonido de notificación
  useEffect(() => {
    if (totalNotificaciones > 0 && !audioPlayedRef.current) {
      reproducirSonido();
      audioPlayedRef.current = true;
    }
  }, [totalNotificaciones]);

  const reproducirSonido = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      console.log('Audio no soportado');
      // Fallback simple
      try {
        const beep = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBmWf2fS7bCgF");
        beep.volume = 0.3;
        beep.play().catch(() => console.log('No se pudo reproducir sonido'));
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        console.log('Sonido no disponible');
      }
    }
  };

  return (
    <div className="dashboard-header">
      <Group justify="center" align="center">
        {/* Título Centrado */}
        <Stack gap={2} align="center">
          <Text className="dashboard-title">
            MÉTRICAS
          </Text>
          <Text 
            size="lg" 
            c="dimmed" 
            fw={500}
            className="dashboard-subtitle"
          >
            Dashboard de Gestión
          </Text>
        </Stack>

        {/* Notificaciones */}
        <Menu 
          shadow="md" 
          width={350} 
          position="bottom-end"
          opened={menuAbierto}
          onChange={setMenuAbierto}
        >
          <Menu.Target>
            <ActionIcon 
              variant="subtle" 
              color="blue" 
              size="xl" 
              className="notification-bell"
            >
              <IconBell size={25} />
              
              {totalNotificaciones > 0 && (
                <Badge 
                  size="sm" 
                  circle 
                  color="red" 
                  variant="filled"
                  className={`notification-badge ${totalNotificaciones > 0 ? 'pulsing' : ''}`}
                >
                  {totalNotificaciones}
                </Badge>
              )}
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label className="notification-menu-label">
              <span>🔔 Sistema de Alertas</span>
              {totalNotificaciones > 0 && (
                <Badge color="red" variant="light" size="lg">
                  {totalNotificaciones}
                </Badge>
              )}
            </Menu.Label>

            <Menu.Divider />

            {/* ALERTA STOCK BAJO */}
            {notificacionesStock > 0 ? (
              <Menu.Item 
                className="notification-item"
                leftSection={
                  <ThemeIcon color="orange" size="lg" variant="light">
                    <IconAlertTriangle size={18} />
                  </ThemeIcon>
                }
              >
                <div>
                  <Text fw={700} size="md">Stock Crítico</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    {notificacionesStock} productos con stock ≤ 5 unidades
                  </Text>
                </div>
              </Menu.Item>
            ) : (
              <Menu.Item className="notification-item">
                <div>
                  <Text fw={600} c="green">✅ Stock Normal</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    Sin productos con stock crítico
                  </Text>
                </div>
              </Menu.Item>
            )}

            {/* ALERTA VENCIMIENTO */}
            {notificacionesVencimiento > 0 ? (
              <Menu.Item 
                className="notification-item"
                leftSection={
                  <ThemeIcon color="red" size="lg" variant="light">
                    <IconCalendarExclamation size={18} />
                  </ThemeIcon>
                }
              >
                <div>
                  <Text fw={700} size="md">Vencimiento Próximo</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    {notificacionesVencimiento} productos por vencer en ≤ 10 días
                  </Text>
                </div>
              </Menu.Item>
            ) : (
              <Menu.Item className="notification-item">
                <div>
                  <Text fw={600} c="green">✅ Vencimientos OK</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    Sin productos por vencer pronto
                  </Text>
                </div>
              </Menu.Item>
            )}

            <Menu.Divider />
            
            <Menu.Item className="notification-time">
              <Text size="xs" c="dimmed" ta="center">
                Actualizado: {fechaHora.hora}
              </Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
}

export default Header;