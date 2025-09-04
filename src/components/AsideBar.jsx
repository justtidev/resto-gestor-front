import { useState, useContext } from 'react';
 import { LayoutDashboard, Utensils, ClipboardList, FileText, Users, Folder, Image, Table } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';

export default function AsideBar() {
  const { userRole } = useContext(AuthContext);
  const location = useLocation();

  const [adminOpen, setAdminOpen] = useState(
    location.pathname.startsWith("/admin")
  );

  const toggleAdminMenu = () => setAdminOpen(!adminOpen);

  const baseItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Menu', icon: <Utensils size={18} />, path: '/menu' },
    { name: 'Cierre Caja', icon: <ClipboardList size={18} />, path: '/cierre' },
  ];

const adminItems = [
  { name: 'Usuarios', icon: <Users size={16} />, path: '/admin/usuario' },
 
  { name: 'Categorías', icon: <Folder size={16} />, path: '/admin/categoria' },
  { name: 'Imágenes', icon: <Image size={16} />, path: '/admin/imagen' },
  { name: 'Menu Items', icon: <Utensils size={16} />, path: '/admin/menuItem' },
  { name: 'Mesas', icon: <Table size={16} />, path: '/admin/mesa' },
];
 

  return (
    <aside className="w-64 min-h-screen bg-[#263238] text-white p-6 flex flex-col justify-between">
      <div>
        <Logo />
        <nav className="mt-8 space-y-2">

          {/* Items base */}
          {baseItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#F4C430] text-[#212121]'
                    : 'hover:bg-[#37474F]'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          {/* Administrador */}
          {userRole === 1  || userRole === 3 && (
            <div>
              <button
                onClick={toggleAdminMenu}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#37474F] transition"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  Administración
                </div>
                <span>{adminOpen ? '▲' : '▼'}</span>
              </button>

              {/* Submenú */}
              {adminOpen && (
                <div className="ml-8 mt-1 flex flex-col gap-1">
                  {adminItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                          isActive
                            ? 'bg-[#F4C430] text-[#212121]'
                            : 'hover:bg-[#455A64]'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <p className="text-sm text-[#CFD8DC] mt-4">© 2025 Justina Navarro</p>
    </aside>
  );
}
