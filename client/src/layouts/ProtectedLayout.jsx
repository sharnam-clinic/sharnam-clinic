import { useState, useEffect  } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../utils/api';
import '../admin.css';

const ProtectedLayout = () => {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  // Default fallback menus for demo / overview when database is not connected
  const defaultAdminMenus = [
    { id: 8, menuName: 'Categories', listPageRoute: '/admin/categories', formPageRoute: '/admin/categories/new', icon: 'Tags', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
    { id: 2, menuName: 'Clinic Photos', listPageRoute: '/admin/clinic-photos', icon: 'Image', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
    { id: 3, menuName: 'Services', listPageRoute: '/admin/services', icon: 'Activity', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
    { id: 4, menuName: 'Health Conditions', listPageRoute: '/admin/health-conditions', icon: 'Stethoscope', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
    { id: 9, menuName: 'Patient Inquiries', listPageRoute: '/admin/inquiries', icon: 'Inbox', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
    { id: 5, menuName: 'Users Master', listPageRoute: '/admin/users', icon: 'Users', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
    { id: 6, menuName: 'User Types', listPageRoute: '/admin/user-types', icon: 'Shield', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
    { id: 7, menuName: 'Role Permissions', listPageRoute: '/admin/role-permission', icon: 'Key', userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 } },
  ];

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get('/menus/my-menus');
        if (response.data?.status && response.data.result?.length > 0) {
          const filtered = response.data.result.filter(
            (m) => m.menuName?.toLowerCase() !== 'dashboard' && m.listPageRoute !== '/admin'
          );
          setMenus(filtered);
        } else {
          setMenus(defaultAdminMenus);
        }
      } catch (error) {
        console.warn('Backend unavailable, using default admin menus for overview:', error.message);
        setMenus(defaultAdminMenus);
      } finally {
        setLoadingMenus(false);
      }
    };
    if (token) {
      fetchMenus();
    } else {
      setLoadingMenus(false);
    }
  }, [token]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const isAllowedPath = () => {
    // If running in mock / overview mode, always grant full access
    if (token === 'mock-admin-token-sharnam-demo') return true;
    if (loadingMenus) return true; // Wait for menus to load

    // Super Admin role always has full permission to all routes
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (
        storedUser?.userType === 1 || 
        Number(storedUser?.userType) === 1 || 
        storedUser?.role === 'admin' || 
        storedUser?.userTypeName === 'Super Admin'
      ) {
        return true;
      }
    } catch {}

    const currentPath = location.pathname;
    
    // Always allow the base admin dashboard
    if (currentPath === '/admin' || currentPath === '/admin/') return true;

    // Check if path matches any permitted menu
    return menus.some(menu => {
      if (!menu.listPageRoute) return false;
      if (currentPath === menu.listPageRoute) return true; // Has read access by definition
      
      if (currentPath.startsWith(menu.listPageRoute + '/')) {
        if (currentPath.includes('/new')) {
          return Number(menu.userPermission?.isWrite) === 1;
        }
        if (currentPath.includes('/edit')) {
          return Number(menu.userPermission?.isEdit) === 1;
        }
        return true;
      }
      
      if (menu.formPageRoute) {
        if (currentPath === menu.formPageRoute) {
          return Number(menu.userPermission?.isWrite) === 1 || Number(menu.userPermission?.isEdit) === 1;
        }
        if (currentPath.startsWith(menu.formPageRoute + '/')) {
          return Number(menu.userPermission?.isEdit) === 1;
        }
      }
      return false;
    });
  };

  return (
    <div className="admin-layout admin-panel flex h-screen bg-[#f8fafc] font-body-md text-gray-800 overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menus={menus} />

      {/* Main Content Area — min-w-0 prevents flex shrink collapse */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        
        {/* Header Component */}
        <Header toggleSidebar={toggleSidebar} menus={menus} />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            {!loadingMenus && !isAllowedPath() ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-2xl p-8 border border-gray-200/80 shadow-xs mt-8">
                <div className="w-16 h-16 mb-4 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl">
                  🚫
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
                <p className="text-sm text-gray-500 max-w-md">
                  You don't have permission to view this page. If you believe this is an error, please contact your administrator.
                </p>
              </div>
            ) : (
              <Outlet context={{ menus }} />
            )}
          </div>
        </main>
        
        {/* Subtle Minimal Admin Footer */}
        <footer className="bg-white border-t border-gray-200/75 px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 shrink-0">
          <div>
            © {new Date().getFullYear()} Sharnam Clinic Admin Portal. All rights reserved.
          </div>
          <div className="flex items-center gap-4 mt-1 sm:mt-0">
            <span className="text-gray-400">v1.0.0</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Active
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ProtectedLayout;
