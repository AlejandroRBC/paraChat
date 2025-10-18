import { useNavbar } from './hooks/useNavbar';
import { MantineSidebar } from './components/MantineSidebar';
import { ActionIcon, Group, AppShell, Text, Burger } from '@mantine/core';
import { IconMenu2, IconBuildingStore } from '@tabler/icons-react';
import { useMediaQuery } from 'react-responsive';
import './navbar.css';

function Navbar({ children }) {
  const { esMenuAbierto, abrirMenu, cerrarMenu } = useNavbar();
  
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  return (
    <>
      <AppShell.Header className="navbar-header">
        <Group justify="space-between" h="100%" px={isMobile ? "md" : "lg"}>
          <Group gap={isMobile ? "sm" : "xl"}>
            {isMobile ? (
              <Burger
                opened={esMenuAbierto}
                onClick={esMenuAbierto ? cerrarMenu : abrirMenu}
                size="sm"
              />
            ) : (
              <ActionIcon 
                variant="gradient" 
                size={isMobile ? "lg" : "xl"}
                onClick={abrirMenu}
                className="navbar-toggle"
                gradient={{ from: 'blue.7', to: 'cyan.5' }}
              >
                <IconMenu2 size={isMobile ? 20 : 24} />
              </ActionIcon>
            )}
            
            <Group gap={isMobile ? "xs" : "sm"} className="logo-container">
              <div className="logo-wrapper">
                <img
                  src="/img/logo.png"
                  alt="Farmacia Oasis"
                  className="navbar-logo"
                />
                <div className="logo-glow"></div>
              </div>
              <div className="brand-text">
                <Text className="brand-name" fw={700} size={isMobile ? "sm" : "md"}>
                  {isMobile ? 'FARMACIA' : 'FARMACIA OASIS'}
                </Text>
              </div>
            </Group>
          </Group>
          
          <Group gap={isMobile ? "sm" : "md"} className="navbar-right">
  {!isMobile && (
    <Group gap="xs" className="welcome-section">
      <IconBuildingStore size={isTablet ? 18 : 20} color="white" />
      <div className="welcome-text">
        <Text size={isTablet ? "xs" : "sm"} fw={600}>Bienvenido</Text>
        <Text size="xs" opacity={0.8}>Sistema de Gestión</Text>
      </div>
    </Group>
  )}
</Group>
        </Group>
      </AppShell.Header>

      <div className={`sidebar-overlay ${esMenuAbierto ? 'active' : ''}`}>
        <div className="sidebar-backdrop" onClick={cerrarMenu}></div>
        <div className="sidebar-wrapper">
          <MantineSidebar onClose={cerrarMenu} />
        </div>
      </div>

      <AppShell.Main className="main-content">
        {children}
      </AppShell.Main>
    </>
  );
}

export default Navbar;