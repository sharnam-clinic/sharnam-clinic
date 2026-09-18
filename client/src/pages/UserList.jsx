import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { menus } = useOutletContext();
  const location = useLocation();
  const currentMenu = menus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data.status) {
        setUsers(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-xs">
        <p className="font-body-md m-0">Are you sure you want to delete this user?</p>
        <div className="flex gap-sm justify-end mt-2">
          <button
            className="px-md py-xs bg-error text-on-error rounded-md text-sm font-label-md"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/users/${id}`);
                fetchUsers();
                toast.success('Deleted successfully');
              } catch (error) {
                console.error('Failed to delete user', error);
                toast.error(error.response?.data?.message || 'Error deleting user');
              }
            }}
          >
            Delete
          </button>
          <button
            className="px-md py-xs bg-[#444] rounded-md text-sm text-white font-label-md"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const columns = [
    { key: 'name', label: 'User Name', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true },
    { key: 'phone', label: 'Phone Number', sortable: true },
    {
      key: 'userType',
      label: 'Role',
      render: (_, row) => (
        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
          {row.userTypeRole ? row.userTypeRole.userType : 'Administrator'}
        </span>
      )
    },
    {
      key: 'isStatus',
      label: 'Status',
      render: (status) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status === 1
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
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/users/edit/${row.id}`}
            className="p-1.5 text-gray-500 hover:text-[#cc3b38] hover:bg-red-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-400 text-sm">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Users Management</h2>
          <p className="text-sm text-gray-500 mt-1">View, manage, and assign system access permissions.</p>
        </div>
        <Link
          to="/admin/users/new"
          className="inline-flex items-center justify-center gap-2 bg-[#cc3b38] hover:bg-[#b52f2c] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus size={16} />
          Add New User
        </Link>
      </div>

      <DataTable columns={columns} data={users} exportFileName="Sharnam_Users" />
    </div>
  );
};

export default UserList;
