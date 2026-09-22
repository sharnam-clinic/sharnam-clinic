import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import ClinicLogo from './client/ClinicLogo';

const Sidebar = ({ isOpen, toggleSidebar, menus = [] }) => {
  const location = useLocation();

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Folder;
    return <IconComponent size={18} />;
  };

  // Filter out Dashboard
  const activeMenus = menus.filter(
    (m) => !m.parentId && m.menuName?.toLowerCase() !== 'dashboard' && m.listPageRoute !== '/admin'
  );

  // Separate into Clinic Management vs User & Access Control
  const isUserAccessMenu = (item) => {
    const route = item.listPageRoute || '';
    const name = item.menuName?.toLowerCase() || '';
    return (
      route.startsWith('/admin/users') ||
      route.startsWith('/admin/user-types') ||
      route.startsWith('/admin/role-permission') ||
      route.startsWith('/admin/permissions') ||
      name.includes('user') ||
      name.includes('permission') ||
      name.includes('role')
    );
  };

  const clinicMenus = activeMenus.filter((m) => !isUserAccessMenu(m));
  const userAccessMenus = activeMenus.filter((m) => isUserAccessMenu(m));

  const renderMenuItem = (item) => {
    const path = item.listPageRoute || '#';
    const isActive = path === '/admin' 
      ? location.pathname === '/admin' || location.pathname === '/admin/'
      : location.pathname === path || location.pathname.startsWith(path + '/');

    return (
      <Link
        key={item.id}
        to={path}
        onClick={() => {
          if (isOpen) toggleSidebar();
        }}
        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
          isActive
            ? 'bg-red-50 text-[#cc3b38] font-semibold shadow-xs border border-red-100/70'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            isActive
              ? 'bg-[#cc3b38] text-white shadow-xs'
              : 'bg-gray-100/90 text-gray-500 group-hover:bg-gray-200/80 group-hover:text-gray-800'
          }`}
        >
          {renderIcon(item.icon)}
        </div>
        <span className="truncate">{item.menuName}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200/80 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:static lg:w-64 shrink-0 shadow-sm lg:shadow-none`}
      >
        {/* Logo */}
        <div className="h-18 flex items-center justify-between px-5 border-b border-gray-100">
          <Link to="/admin" className="hover:opacity-90 transition-opacity flex items-center">
            <ClinicLogo size="md" />
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Navigation List with Two Grouped Sections */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          
          {/* Main Dashboard Link */}
          <div className="space-y-1">
            {renderMenuItem({
              id: 'dashboard-home',
              listPageRoute: '/admin',
              menuName: 'Welcome Screen',
              icon: 'LayoutDashboard'
            })}
          </div>

          {/* Section 1: Clinic Management */}
          {clinicMenus.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Clinic Management
                </span>
              </div>
              <div className="space-y-1">{clinicMenus.map(renderMenuItem)}</div>
            </div>
          )}

          {/* Section 2: User & Access Management */}
          {userAccessMenus.length > 0 && (
            <div className="space-y-1 pt-3 border-t border-gray-100">
              <div className="px-3 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  User & Access Control
                </span>
              </div>
              <div className="space-y-1">{userAccessMenus.map(renderMenuItem)}</div>
            </div>
          )}
        </nav>

        {/* Bottom footer badge */}
        <div className="p-3 border-t border-gray-100 mt-auto">
          <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-gray-800 truncate">Sharnam Clinic</p>
              <p className="text-[11px] text-gray-400 truncate">Admin Portal</p>
            </div>
            <span className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded-md font-mono text-gray-500 font-semibold shrink-0">
              v1.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
