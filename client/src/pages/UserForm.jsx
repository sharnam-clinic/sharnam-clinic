import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 1,
    isStatus: 1
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const defaultUserTypes = [
      { id: 1, userType: 'Super Admin' },
      { id: 2, userType: 'Clinic Staff' },
      { id: 3, userType: 'Doctor' }
    ];

    const fetchInitialData = async () => {
      try {
        let loadedTypes = defaultUserTypes;
        try {
          const utResponse = await api.get('/user-types');
          if (utResponse.data?.status && utResponse.data.result?.length > 0) {
            loadedTypes = utResponse.data.result;
          }
        } catch (utErr) {
          console.warn('Backend user-types offline, using default user types');
        }
        setUserTypes(loadedTypes);

        if (!isEditMode && loadedTypes.length > 0) {
          setFormData(prev => ({ ...prev, userType: loadedTypes[0].id }));
        }

        if (isEditMode) {
          try {
            const response = await api.get(`/users/${id}`);
            if (response.data?.status && response.data.result) {
              const user = response.data.result;
              setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                password: user.password || '',
                userType: user.userType || loadedTypes[0].id,
                isStatus: user.isStatus ?? 1
              });
            }
          } catch (userErr) {
            console.warn('User fetch error, using form state');
          }
        }
      } catch (err) {
        setUserTypes(defaultUserTypes);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'userType' || name === 'isStatus' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // If editing and password is empty, remove it from payload
      const payload = { ...formData };
      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      if (isEditMode) {
        await api.put(`/users/${id}`, payload);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', payload);
        toast.success('User created successfully');
      }
      navigate('/admin/users');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px] text-gray-400 text-sm">
      Loading user details...
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Edit User Profile' : 'Create New User'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure clinic staff credentials and assign administrative roles.
          </p>
        </div>
        <Link 
          to="/admin/users" 
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200/80 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Dr. Dhairya Mehta"
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@sharnam.com"
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 pr-11 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* User Type */}
            <div className="space-y-1.5">
              <label htmlFor="userType" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Role / Access Level <span className="text-red-500">*</span>
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all cursor-pointer"
              >
                <option value="">-- Choose Role / Access Level --</option>
                {userTypes.map(ut => (
                  <option key={ut.id} value={ut.id}>
                    {ut.userType}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="isStatus" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Account Status
              </label>
              <select
                id="isStatus"
                name="isStatus"
                value={formData.isStatus}
                onChange={handleChange}
                className="w-full bg-gray-50/60 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

          </div>

          <div className="pt-5 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/users"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#cc3b38] hover:bg-[#b52f2c] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
