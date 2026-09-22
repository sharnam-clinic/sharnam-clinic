import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';

const HealthConditionList = () => {
  const navigate = useNavigate();
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState({});
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

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
        isWrite: Number(currentMenu.userPermission?.isWrite) === 1 ? 1 : 0,
        isEdit: Number(currentMenu.userPermission?.isEdit) === 1 ? 1 : 0,
        isDelete: Number(currentMenu.userPermission?.isDelete) === 1 ? 1 : 0,
        isRead: Number(currentMenu.userPermission?.isRead) === 1 ? 1 : 0,
      };

  const fetchConditions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/health-conditions');
      if (res.data.status) setConditions(res.data.result);
    } catch (err) {
      console.error('Failed to fetch conditions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConditions();
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.status && res.data.result) {
          const map = {};
          res.data.result.forEach((c) => {
            if (c.slug) map[c.slug] = c.name;
            map[c.name] = c.name;
          });
          setCategoryMap(map);
        }
      } catch {}
    };
    loadCategories();
  }, []);

  const handleDeleteClick = (id) => {
    if (!permissions.isDelete) {
      toast.error('You do not have permission to delete health conditions.');
      return;
    }
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;
    
    try {
      await api.delete(`/health-conditions/${id}`);
      toast.success('Condition deleted successfully');
      fetchConditions();
    } catch (err) {
      console.error('Failed to delete condition', err);
      toast.error(err.response?.data?.message || 'Failed to delete condition');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Disease / Condition',
      sortable: true,
      render: (title) => <span className="font-semibold text-gray-900">{title}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (cat) => (
        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
          {categoryMap[cat] || cat || 'General'}
        </span>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      render: (icon) => (
        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#cc3b38] flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">{icon || 'stethoscope'}</span>
        </div>
      ),
    },
    { key: 'sortOrder', label: 'Order', sortable: true },
    {
      key: 'isStatus',
      label: 'Status',
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
                onClick={() => navigate(`/admin/health-conditions/edit/${row.id}`)}
                className="p-1.5 text-gray-500 hover:text-[#cc3b38] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Edit Condition"
              >
                <Icons.Edit2 size={16} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => handleDeleteClick(row.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Condition"
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Health Conditions Directory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage illnesses, clinical symptoms, and homeopathic treatment guides.
          </p>
        </div>
        {Boolean(permissions.isWrite) && (
          <button
            onClick={() => navigate('/admin/health-conditions/new')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#cc3b38] hover:bg-[#b52f2c] text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Icons.Plus size={16} />
            Add New Condition
          </button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={conditions}
        loading={loading}
        exportFileName="health_conditions_export"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Health Condition"
        message="Are you sure you want to permanently delete this condition? This action cannot be undone."
      />
    </div>
  );
};

export default HealthConditionList;
