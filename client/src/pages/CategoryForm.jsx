import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    isStatus: 1,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchCategory = async () => {
        try {
          setFetching(true);
          const res = await api.get(`/categories/${id}`);
          if (res.data.status && res.data.result) {
            const cat = res.data.result;
            setFormData({
              name: cat.name || '',
              isStatus: cat.isStatus ?? 1,
            });
          }
        } catch (err) {
          console.error('Failed to fetch category details', err);
          setError('Failed to load category details');
          toast.error('Failed to load category details');
        } finally {
          setFetching(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category Name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const autoSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const payload = {
        name: formData.name.trim(),
        slug: autoSlug,
        isStatus: Number(formData.isStatus),
      };

      if (isEdit) {
        await api.put(`/categories/${id}`, payload);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', payload);
        toast.success('Category created successfully');
      }

      navigate('/admin/categories');
    } catch (err) {
      console.error('Failed to save category', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save category';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#cc3b38] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure clinic categories used across Services and Health Conditions.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/categories')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <Icons.ArrowLeft size={16} /> Back to Categories
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs max-w-2xl">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm mb-6 flex items-start gap-2">
            <Icons.AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                CATEGORY NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
                placeholder="e.g., Chronic Care, Skin & Hair, Pediatric Health"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                STATUS
              </label>
              <select
                name="isStatus"
                value={formData.isStatus}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              <p className="text-[11px] text-gray-400">Only Active categories appear in forms and public catalogs.</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#cc3b38] hover:bg-[#b52f2c] text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {loading && <Icons.Loader2 size={16} className="animate-spin" />}
              {isEdit ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
