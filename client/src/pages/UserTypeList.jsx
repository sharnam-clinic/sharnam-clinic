import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';

const UserTypeList = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const outlet = useOutletContext() || {};
  const layoutMenus = outlet.menus || [];
  const location = useLocation();
  const currentMenu = layoutMenus.find(m => m.listPageRoute === location.pathname) || {};

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

  const fetchUserTypes = async () => {
    try {
      const response = await api.get('/user-types');
      if (response.data.status) {
        setUserTypes(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch user types', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const handleDeleteClick = (id) => {
    if (!permissions.isDelete) {
      toast.error('You do not have permission to delete user types.');
      return;
    }
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;
    
    try {
      await api.delete(`/user-types/${id}`);
      fetchUserTypes();
      toast.success('User Type deleted successfully');
    } catch (error) {
      console.error('Failed to delete user type', error);
      toast.error(error.response?.data?.message || 'Error deleting user type');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const columns = [
    { key: 'userType', label: 'Role / Type Name', sortable: true },
    {
      key: 'isStatus',
      label: 'Status',
      render: (status) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          status === 1
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          {status === 1 ? 'Active' : 'Inactive'}
        </span>
      )
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
              <Link
                to={`/admin/user-types/edit/${row.id}`}
                className="p-1.5 text-gray-500 hover:text-[#cc3b38] hover:bg-red-50 rounded-lg transition-colors"
                title="Edit Role"
              >
                <Edit size={16} />
              </Link>
            )}
            {canDelete && (
              <button
                onClick={() => handleDeleteClick(row.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Role"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">User Roles & Types</h2>
          <p className="text-sm text-gray-500 mt-1">Manage system user roles, access levels, and categories.</p>
        </div>
        {Boolean(permissions.isWrite) && (
          <Link
            to="/admin/user-types/new"
            className="inline-flex items-center justify-center gap-2 bg-[#cc3b38] hover:bg-[#b52f2c] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-all shrink-0"
          >
            <Plus size={16} />
            Add User Type
          </Link>
        )}
      </div>

      <DataTable columns={columns} data={userTypes} loading={loading} exportFileName="Sharnam_UserTypes" />
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete User Role"
        message="Are you sure you want to permanently delete this user role? This action cannot be undone."
      />
    </div>
  );
};

export default UserTypeList;
