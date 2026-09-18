import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const ClinicPhotoList = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
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
        isWrite: Number(currentMenu.userPermission?.isWrite) === 1 ? 1 : 0,
        isEdit: Number(currentMenu.userPermission?.isEdit) === 1 ? 1 : 0,
        isDelete: Number(currentMenu.userPermission?.isDelete) === 1 ? 1 : 0,
        isRead: Number(currentMenu.userPermission?.isRead) === 1 ? 1 : 0,
      };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clinic-photos');
      if (res.data.status) setPhotos(res.data.result);
    } catch (err) {
      console.error('Failed to fetch photos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id) => {
    if (!permissions.isDelete) {
      toast.error('You do not have permission to delete photos.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await api.delete(`/clinic-photos/${id}`);
        toast.success('Photo deleted successfully');
        fetchPhotos();
      } catch (err) {
        console.error('Failed to delete photo', err);
        toast.error(err.response?.data?.message || 'Failed to delete photo');
      }
    }
  };

  const columns = [
    {
      key: 'imageUrl',
      label: 'Photo Preview',
      render: (url, row) => (
        <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
          <img
            src={url}
            alt={row.title || 'Facility Photo'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      ),
    },
    { key: 'title', label: 'Photo Title', sortable: true },
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
                onClick={() => navigate(`/admin/clinic-photos/edit/${row.id}`)}
                className="p-1.5 text-gray-500 hover:text-[#cc3b38] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Edit Photo"
              >
                <Icons.Edit2 size={16} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => handleDelete(row.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Photo"
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinic Photos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage photos displayed in the "Our Facility" section on the public website.
          </p>
        </div>
        {Boolean(permissions.isWrite) && (
          <button
            onClick={() => navigate('/admin/clinic-photos/new')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#cc3b38] hover:bg-[#b52f2c] text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Icons.Plus size={16} />
            Add New Photo
          </button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={photos}
        loading={loading}
        exportFileName="clinic_photos_export"
      />
    </div>
  );
};

export default ClinicPhotoList;
