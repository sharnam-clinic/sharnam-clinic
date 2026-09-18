import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const Header = ({ toggleSidebar, menus = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Map pathnames to page titles dynamically using MenuMaster
  const getPageTitle = () => {
    // Find the menu whose listPageRoute or formPageRoute matches the current path
    const currentMenu = menus.find((menu) => {
      if (!menu.listPageRoute) return false;
      return location.pathname === menu.listPageRoute || location.pathname.startsWith(menu.listPageRoute + '/');
    });

    if (currentMenu?.menuName) return currentMenu.menuName;
    if (currentMenu?.pageName) return currentMenu.pageName;
    if (location.pathname.includes('/categories')) return 'Categories Master';
    return 'Admin Panel';
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed on backend:', error);
    } finally {
      // Clear all tokens and user info regardless of backend response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="h-18 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-8 z-20 sticky top-0 shadow-xs">
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 shrink-0"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#cc3b38]">{getPageTitle()}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 m-0 truncate tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* User Badge */}
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-full">
          <div className="w-7 h-7 rounded-full bg-[#cc3b38] flex items-center justify-center text-white shrink-0 shadow-xs">
            <User size={14} />
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
            <span className="text-xs font-semibold text-gray-900">
              {user?.name || user?.email?.split('@')[0] || 'Admin'}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {user?.email || 'admin@sharnam.com'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 border border-red-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
          title="Logout"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
