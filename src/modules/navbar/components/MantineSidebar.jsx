import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconPackage,
  IconReceipt2,
  IconListDetails,
  IconLogout,
  IconUser,
  IconUsers,
  IconTruck
} from '@tabler/icons-react';
import { Group, CloseButton, Avatar, Text } from '@mantine/core';
import classes from './MantineSidebar.module.css';

const data = [
  { link: '/', label: 'Dashboard', icon: IconHome },
  { link: '/inventario', label: 'Inventario', icon: IconPackage },
  { link: '/historial-ventas', label: 'Historial Ventas', icon: IconReceipt2 },
  { link: '/ingresos-egresos', label: 'Ingresos y Egresos', icon: IconListDetails },
  { link: '/clientes', label: 'Clientes', icon: IconUsers },
  { link: '/proveedores', label: 'Proveedores', icon: IconTruck },
];

export function MantineSidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const links = data.map((item) => (
    <button
      className={classes.link}
      data-active={item.link === active || undefined}
      key={item.label}
      onClick={() => {
        setActive(item.link);
        navigate(item.link);
        if (onClose) onClose();
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </button>
  ));

  return (
    <nav className={classes.navbar}>
      {/* Header */}
      <div className={classes.header}>
        <Group justify="space-between">
          <div className={classes.logoContainer}>
            <img src="/img/logo.png" alt="Farmacia Oasis" className={classes.logo} />
            <Text size="sm" c="white" fw={600}>Farmacia Oasis</Text>
          </div>
          {onClose && (
            <CloseButton 
              size="md" 
              color="white" 
              onClick={onClose} 
            />
          )}
        </Group>
      </div>

      {/* Navigation Links */}
      <div className={classes.navbarMain}>
        {links}
      </div>

      {/* 
      Si en algun momento queremos meter un usuario o un login asi chalitaFooter
      <div className={classes.footer}>
        <div className={classes.userInfo}>
          <Avatar 
            src={null} 
            alt="Usuario" 
            color="blue"
            size="md"
            className={classes.userAvatar}
          >
            <IconUser size={20} />
          </Avatar>
          <div className={classes.userDetails}>
            <Text size="sm" fw={600} c="white">Administrador</Text>
            <Text size="xs" c="blue.1">Sistema Farmacia</Text>
          </div>
        </div>
        
        <button 
          className={classes.logoutLink}
          onClick={() => {
            console.log('Cerrar sesión');
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar Sesión</span>
        </button>
      </div> */}
    </nav>
  );
}