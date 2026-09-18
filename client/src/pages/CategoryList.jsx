import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract permissions from ProtectedLayout outlet context
  const outlet = useOutletContext() || {};
  const menus = outlet.menus || [];
  const location = useLocation();
  const currentMenu = menus.find((m) => m.listPageRoute === location.pathname) || {};

  let isSuperAdmin = false;
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (
      storedUser?.userType === 1 ||
      Number(storedUser?.userType) === 1 ||
      storedUser?.role === 'admin' ||
      storedUser?.userTypeName === 'Super Admin'
    ) {
      isSuperAdmin = true;
    }
  } catch {}

  const permissions = isSuperAdmin
    ? { isWrite: 1, isEdit: 1, isDelete: 1, isRead: 1 }
    : {
        isWrite: Number(currentMenu.userPermission?.isWrite ?? 1),
        isEdit: Number(currentMenu.userPermission?.isEdit ?? 1),
        isDelete: Number(currentMenu.userPermission?.isDelete ?? 1),
        isRead: Number(currentMenu.userPermission?.isRead ?? 1),
      };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.status) {
        setCategories(res.data.result || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!permissions.isDelete) {
      toast.error('You do not have permission to delete categories.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this category? Services or Conditions under it may need reassignment.')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category', err);
        toast.error(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      render: (name) => <span className="font-semibold text-gray-900 text-sm">{name}</span>,
    },
    {
      key: 'isStatus',
      label: 'Status',
      sortable: true,
      render: (status) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            status === 1
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          {status === 1 ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => {
        const canEdit = Boolean(permissions.isEdit);
        const canDelete = Boolean(permissions.isDelete);

        if (!canEdit && !canDelete) {
          return <span className="text-xs text-gray-400 italic">View only</span>;
        }

        return (
          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => navigate(`/admin/categories/edit/${row.id}`)}
                className="p-1.5 text-gray-500 hover:text-[#cc3b38] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Edit Category"
              >
                <Icons.Edit2 size={16} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => handleDelete(row.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Category"
              >
                <Icons.Trash2 size={16} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories Master</h1>
          <p className="text-sm text-gray-500 mt-1">
            Centrally manage medical and clinical categories bound across Services, Health Conditions, and Website filters.
          </p>
        </div>
        {Boolean(permissions.isWrite) && (
          <button
            onClick={() => navigate('/admin/categories/new')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#cc3b38] hover:bg-[#b52f2c] text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Icons.Plus size={16} />
            Add New Category
          </button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        exportFileName="categories_export"
      />
    </div>
  );
};

export default CategoryList;
