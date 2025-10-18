import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

 const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/inventario', label: 'Inventario', icon: '📦' },
    { path: '/historial-ventas', label: 'Historial Ventas', icon: '📊' },
    { path: '/ingresos-egresos', label: 'Ingresos y egresos', icon: '📋' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/proveedores', label: 'Proveedores y Mercancia', icon: '🚚' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar" onClick={(e) => e.stopPropagation()}>
      <button className="cerrar-btn" onClick={onClose}>
        &times;
      </button>
      
      <div className="menu-items">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.path);
            }}
          >
            <span className="menu-icon">{item.icon}</span>
            <i>{item.label}</i>
          </a>
        ))}
      </div>

      
    </div>
  );
}

export default Sidebar;