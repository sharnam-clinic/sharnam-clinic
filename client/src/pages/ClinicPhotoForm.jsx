import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { supabase } from '../utils/supabase';

const ClinicPhotoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    sortOrder: 0,
    isStatus: 1,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchPhoto();
    }
  }, [id]);

  const fetchPhoto = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/clinic-photos/${id}`);
      if (res.data.status) {
        setFormData(res.data.result);
      }
    } catch (err) {
      setError('Failed to fetch clinic photo');
    } finally {
      setLoading(false);
    }
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file size exceeds 100KB (100 * 1024 bytes)
    if (file.size > 100 * 1024) {
      toast.error('Image size must be less than 100KB');
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const fileExt = file.name.split('.').pop();
      const fileName = Math.random().toString(36).substring(2) + '_' + Date.now() + '.' + fileExt;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      setFormData((prev) => ({ ...prev, imageUrl: data.publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setError('Error uploading image: ' + err.message);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/clinic-photos/${id}`, formData);
        toast.success('Clinic photo updated successfully');
      } else {
        await api.post('/clinic-photos', formData);
        toast.success('Clinic photo added successfully');
      }
      navigate('/admin/clinic-photos');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
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
            {isEdit ? 'Edit Clinic Photo' : 'Add New Clinic Photo'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload or link a photo for the "Our Facility" section.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/clinic-photos')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <Icons.ArrowLeft size={16} /> Back to Photos
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs max-w-3xl">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm mb-6 flex items-start gap-2">
            <Icons.AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Photo Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
                placeholder="e.g., Consultation Room"
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

          
          {/* Image File Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Upload Image <span className="text-red-500">*</span> <span className="text-[10px] text-gray-400 lowercase normal-case">(Max 100KB)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#fcebeb] file:text-[#cc3b38] hover:file:bg-[#fbdada] transition-all cursor-pointer"
              />
              {uploading && <Icons.Loader2 size={20} className="animate-spin text-[#cc3b38]" />}
            </div>
            {formData.imageUrl && (
              <p className="text-[11px] text-green-600 font-semibold mt-1">
                ✓ Image successfully attached.
              </p>
            )}
          </div>



          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 max-w-sm">
              <span className="text-xs font-medium text-gray-500 block mb-2">Live Image Preview:</span>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-white border border-gray-200">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }} 
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Description / Caption
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              placeholder="Short description of the facility area..."
            ></textarea>
          </div>

          {/* Status Checkbox */}
          <div className="pt-1">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isStatus"
                checked={formData.isStatus === 1}
                onChange={handleChange}
                className="w-4 h-4 text-[#cc3b38] border-gray-300 rounded focus:ring-[#cc3b38]"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (Visible in website gallery)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/clinic-photos')}
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
              {loading ? 'Saving...' : 'Save Clinic Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicPhotoForm;
