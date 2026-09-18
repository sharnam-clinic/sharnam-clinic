import axios from 'axios';
import {
  servicesController,
  healthConditionsController,
  clinicPhotosController,
  usersController,
  userTypesController,
  permissionsController,
  menusController,
  authController,
  categoryController,
  inquiriesController,
} from '../controllers';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      const publicRoutes = ['/', '/login', '/about', '/contact', '/experts', '/specialities'];
      const isPublicRoute = publicRoutes.some(
        (route) => window.location.pathname === route || window.location.pathname.startsWith(route + '/')
      );
      if (!isPublicRoute) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to wrap controller output into the standardized API format
const formatSuccess = (result) => ({
  data: {
    status: true,
    result,
  },
});

const formatError = (error) => {
  const message = error.message || 'Operation failed';
  const err = new Error(message);
  err.response = {
    data: {
      status: false,
      message,
    },
  };
  return Promise.reject(err);
};

// Supabase Local Router for direct database operations
const handleSupabaseRoute = async (method, path, data = null) => {
  const cleanPath = path.split('?')[0].replace(/^\/+|\/+$/g, '');
  const segments = cleanPath.split('/');
  const resource = segments[0];
  const param = segments[1];

  try {
    // 1. Authentication
    if (resource === 'auth') {
      if (param === 'login' && method === 'post') {
        const result = await authController.login(data.email, data.password);
        return formatSuccess(result);
      }
      if (param === 'logout' && method === 'post') {
        const result = await authController.logout();
        return formatSuccess(result);
      }
    }

    // 2. Menus
    if (resource === 'menus') {
      if (param === 'my-menus' && method === 'get') {
        const currentUser = authController.getCurrentUser();
        const userTypeId = currentUser?.userType || 1;
        const result = await menusController.getMyMenus(userTypeId);
        return formatSuccess(result);
      }
      if (!param && method === 'get') {
        const result = await menusController.getAll();
        return formatSuccess(result);
      }
    }

    // 3. Services
    if (resource === 'services') {
      if (!param && method === 'get') return formatSuccess(await servicesController.getAll());
      if (param && method === 'get') return formatSuccess(await servicesController.getById(param));
      if (!param && method === 'post') return formatSuccess(await servicesController.create(data));
      if (param && method === 'put') return formatSuccess(await servicesController.update(param, data));
      if (param && method === 'delete') return formatSuccess(await servicesController.delete(param));
    }

    // 4. Health Conditions
    if (resource === 'health-conditions') {
      if (!param && method === 'get') return formatSuccess(await healthConditionsController.getAll());
      if (param && method === 'get') return formatSuccess(await healthConditionsController.getById(param));
      if (!param && method === 'post') return formatSuccess(await healthConditionsController.create(data));
      if (param && method === 'put') return formatSuccess(await healthConditionsController.update(param, data));
      if (param && method === 'delete') return formatSuccess(await healthConditionsController.delete(param));
    }

    // 5. Clinic Photos
    if (resource === 'clinic-photos') {
      if (!param && method === 'get') return formatSuccess(await clinicPhotosController.getAll());
      if (param && method === 'get') return formatSuccess(await clinicPhotosController.getById(param));
      if (!param && method === 'post') return formatSuccess(await clinicPhotosController.create(data));
      if (param && method === 'put') return formatSuccess(await clinicPhotosController.update(param, data));
      if (param && method === 'delete') return formatSuccess(await clinicPhotosController.delete(param));
    }

    // 6. Users
    if (resource === 'users') {
      if (!param && method === 'get') return formatSuccess(await usersController.getAll());
      if (param && method === 'get') return formatSuccess(await usersController.getById(param));
      if (!param && method === 'post') return formatSuccess(await usersController.create(data));
      if (param && method === 'put') return formatSuccess(await usersController.update(param, data));
      if (param && method === 'delete') return formatSuccess(await usersController.delete(param));
    }

    // 7. User Types
    if (resource === 'user-types') {
      if (!param && method === 'get') return formatSuccess(await userTypesController.getAll());
      if (param && method === 'get') return formatSuccess(await userTypesController.getById(param));
      if (!param && method === 'post') return formatSuccess(await userTypesController.create(data));
      if (param && method === 'put') return formatSuccess(await userTypesController.update(param, data));
      if (param && method === 'delete') return formatSuccess(await userTypesController.delete(param));
    }

    // 8. Permissions
    if (resource === 'permissions') {
      if (param && param !== 'bulk' && method === 'get') {
        return formatSuccess(await permissionsController.getByUserTypeId(param));
      }
      if (param === 'bulk' && method === 'post') {
        return formatSuccess(await permissionsController.saveBulk(data.userTypeId, data.permissions));
      }
    }

    // 9. Categories
    if (resource === 'categories') {
      if (!param && method === 'get') return formatSuccess(await categoryController.getAll());
      if (param && method === 'get') return formatSuccess(await categoryController.getById(param));
      if (!param && method === 'post') return formatSuccess(await categoryController.create(data));
      if (param && method === 'put') return formatSuccess(await categoryController.update(param, data));
      if (param && method === 'delete') return formatSuccess(await categoryController.delete(param));
    }

    // 10. Inquiries (Contact Messages from Frontend)
    if (resource === 'inquiries') {
      if (!param && method === 'get') return formatSuccess(await inquiriesController.getAll());
      if (!param && method === 'post') return formatSuccess(await inquiriesController.create(data));
      if (param && segments[2] === 'read' && method === 'put') {
        return formatSuccess(await inquiriesController.markAsRead(param, data?.isRead ?? 1));
      }
      if (param && method === 'delete') return formatSuccess(await inquiriesController.delete(param));
    }

    return formatError(new Error(`Route not handled in Supabase controller: ${method.toUpperCase()} /${cleanPath}`));
  } catch (err) {
    return formatError(err);
  }
};

const api = {
  get: (url, config) => {
    if (baseURL) return axiosInstance.get(url, config);
    return handleSupabaseRoute('get', url);
  },
  post: (url, data, config) => {
    if (baseURL) return axiosInstance.post(url, data, config);
    return handleSupabaseRoute('post', url, data);
  },
  put: (url, data, config) => {
    if (baseURL) return axiosInstance.put(url, data, config);
    return handleSupabaseRoute('put', url, data);
  },
  delete: (url, config) => {
    if (baseURL) return axiosInstance.delete(url, config);
    return handleSupabaseRoute('delete', url);
  },
  interceptors: axiosInstance.interceptors,
};

export default api;