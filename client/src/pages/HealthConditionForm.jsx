import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import * as Icons from 'lucide-react';

const HealthConditionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '', category: '', icon: '', shortSummary: '', 
    symptoms: [], causes: [], prevention: [], whenToSeeDoctor: '',
    sortOrder: 0, isStatus: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Local state for list builders
  const [inputs, setInputs] = useState({ symptom: '', cause: '', prevent: '' });

  useEffect(() => {
    if (isEdit) fetchCondition();
  }, [id]);

  const fetchCondition = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/health-conditions/${id}`);
      if (res.data.status) setFormData(res.data.result);
    } catch (err) { setError('Failed to fetch health condition'); } 
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }));
  };

  const addListArrayItem = (arrayName, inputKey) => {
    if (inputs[inputKey].trim()) {
      setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], inputs[inputKey].trim()] }));
      setInputs(prev => ({ ...prev, [inputKey]: '' }));
    }
  };

  const removeListArrayItem = (arrayName, index) => {
    setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isEdit) await api.put(`/health-conditions/${id}`, formData);
      else await api.post('/health-conditions', formData);
      navigate('/admin/health-conditions');
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); } 
    finally { setLoading(false); }
  };

  const ListBuilder = ({ label, arrayName, inputKey, placeholder }) => (
    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200 space-y-3">
      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputs[inputKey]} 
          onChange={(e) => setInputs(prev => ({...prev, [inputKey]: e.target.value}))} 
          placeholder={placeholder} 
          className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListArrayItem(arrayName, inputKey))}
        />
        <button 
          type="button" 
          onClick={() => addListArrayItem(arrayName, inputKey)} 
          className="bg-[#2c7a94] hover:bg-[#236378] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          + Add
        </button>
      </div>
      {formData[arrayName].length > 0 && (
        <ul className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
          {formData[arrayName].map((item, idx) => (
            <li key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 shadow-2xs">
              <span className="truncate pr-2">• {item}</span>
              <button 
                type="button" 
                onClick={() => removeListArrayItem(arrayName, idx)} 
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
              >
                <Icons.Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Health Condition' : 'Add New Health Condition'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage disease details, symptoms, causes, and treatment advice.
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/health-conditions')} 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <Icons.ArrowLeft size={16} /> Back to Directory
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs max-w-5xl">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm mb-6 flex items-start gap-2">
            <Icons.AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Disease Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="title" 
                required 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
                placeholder="e.g., Atopic Dermatitis / Eczema" 
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
                <option value="skin">Skin & Hair</option>
                <option value="respiratory">Respiratory Health</option>
                <option value="digestive">Digestive Disorders</option>
                <option value="women">Women's Health</option>
                <option value="chronic">Chronic Illness</option>
              </select>
            </div>

            {/* Icon */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Icon (Material Symbol)
              </label>
              <input 
                type="text" 
                name="icon" 
                value={formData.icon} 
                onChange={handleChange} 
                placeholder="e.g., healing, spa"
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all" 
              />
            </div>
          </div>

          {/* Short Summary */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Clinical Overview & Short Summary
            </label>
            <textarea 
              name="shortSummary" 
              rows="2" 
              value={formData.shortSummary} 
              onChange={handleChange} 
              className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              placeholder="Brief description of the health condition..."
            ></textarea>
          </div>

          {/* List Builders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ListBuilder label="Common Symptoms" arrayName="symptoms" inputKey="symptom" placeholder="Add symptom..." />
            <ListBuilder label="Key Causes & Triggers" arrayName="causes" inputKey="cause" placeholder="Add cause..." />
            <ListBuilder label="Prevention & Lifestyle Tips" arrayName="prevention" inputKey="prevent" placeholder="Add tip..." />
          </div>

          {/* When to See Doctor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              When to Consult Dr. Mehta
            </label>
            <textarea 
              name="whenToSeeDoctor" 
              rows="2" 
              value={formData.whenToSeeDoctor} 
              onChange={handleChange} 
              className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              placeholder="Red flag symptoms or reasons to book a consultation..."
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
                Active (Published in health directory)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/admin/health-conditions')} 
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
              {loading ? 'Saving...' : 'Save Condition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthConditionForm;
