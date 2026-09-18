import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services');
      if (res.data.status) setServices(res.data.result);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error('Failed to delete service', err);
      }
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Service Name', 
      sortable: true,
      render: (name) => (
        <span className="font-semibold text-gray-900">{name}</span>
      )
    },
    { 
      key: 'category', 
      label: 'Category', 
      sortable: true,
      render: (cat) => (
        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
          {cat || 'General'}
        </span>
      )
    },
    { 
      key: 'icon', 
      label: 'Icon',
      render: (icon) => (
        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#cc3b38] flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">{icon || 'medical_services'}</span>
        </div>
      )
    },
    { key: 'sortOrder', label: 'Order', sortable: true },
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
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/services/edit/${row.id}`)}
            className="p-1.5 text-gray-500 hover:text-[#cc3b38] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Service"
          >
            <Icons.Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Service"
          >
            <Icons.Trash2 size={16} />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Services & Treatments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage constitutional homeopathic services and specialized care packages.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/services/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#cc3b38] hover:bg-[#b52f2c] text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Icons.Plus size={16} />
          Add New Service
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        exportFileName="services_export"
      />
    </div>
  );
};

export default ServiceList;
