import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import * as Icons from 'lucide-react';

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    icon: '',
    description: '',
    whatsIncluded: [],
    approach: '',
    sortOrder: 0,
    isStatus: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (isEdit) fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/services/${id}`);
      if (res.data.status) setFormData(res.data.result);
    } catch (err) {
      setError('Failed to fetch service');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const addIncludedItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({ ...prev, whatsIncluded: [...prev.whatsIncluded, newItem.trim()] }));
      setNewItem('');
    }
  };

  const removeIncludedItem = (index) => {
    setFormData(prev => ({
      ...prev,
      whatsIncluded: prev.whatsIncluded.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) await api.put(`/services/${id}`, formData);
      else await api.post('/services', formData);
      navigate('/admin/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Service' : 'Add New Service'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure treatment details, descriptions, and included features.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/services')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <Icons.ArrowLeft size={16} /> Back to Services
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs max-w-4xl">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm mb-6 flex items-start gap-2">
            <Icons.AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Service Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
                placeholder="e.g., Constitutional Homeopathy"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              >
                <option value="">Select Category</option>
                <option value="chronic">Chronic Care</option>
                <option value="acute">Acute Illnesses</option>
                <option value="pediatric">Pediatric Health</option>
                <option value="women">Women's Health</option>
                <option value="skin">Skin & Hair</option>
                <option value="respiratory">Respiratory Health</option>
                <option value="digestive">Digestive Disorders</option>
                <option value="mental">Mental & Emotional Wellness</option>
              </select>
            </div>

            {/* Icon */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Icon (Material Symbol Name)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g., psychology, spa, healing"
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Sort Order
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Short Summary Description
            </label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              placeholder="Brief overview of what this treatment entails..."
            ></textarea>
          </div>

          {/* What's Included Builder */}
          <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                What's Included (Key Highlights)
              </label>
              <p className="text-xs text-gray-500 mt-0.5">Add bullet points shown on the public service card</p>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newItem} 
                onChange={(e) => setNewItem(e.target.value)} 
                placeholder="e.g., In-depth constitutional case taking" 
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludedItem())}
              />
              <button 
                type="button" 
                onClick={addIncludedItem} 
                className="bg-[#2c7a94] hover:bg-[#236378] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                + Add Point
              </button>
            </div>

            {formData.whatsIncluded.length > 0 && (
              <ul className="mt-3 space-y-2">
                {formData.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 shadow-2xs">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cc3b38]"></span>
                      {item}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => removeIncludedItem(idx)} 
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    >
                      <Icons.Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Treatment Approach */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Treatment Approach & Methodology
            </label>
            <textarea
              name="approach"
              rows="3"
              value={formData.approach}
              onChange={handleChange}
              className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              placeholder="Explain how Dr. Mehta approaches this type of care..."
            ></textarea>
          </div>

          {/* Status Checkbox */}
          <div className="pt-1">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="isStatus"
                name="isStatus"
                checked={formData.isStatus === 1}
                onChange={handleChange}
                className="w-4 h-4 text-[#cc3b38] border-gray-300 rounded focus:ring-[#cc3b38]"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (Show on public website)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/services')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#cc3b38] hover:bg-[#b52f2c] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {loading && <Icons.Loader2 size={16} className="animate-spin" />}
              {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
