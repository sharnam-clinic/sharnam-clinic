import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';

const UserTypeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    userType: '',
    isStatus: 1
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchUserType = async () => {
        try {
          const response = await api.get(`/user-types/${id}`);
          if (response.data.status) {
            const ut = response.data.result;
            setFormData({
              userType: ut.userType,
              isStatus: ut.isStatus
            });
          }
        } catch (err) {
          setError('Failed to load user type data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserType();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isStatus' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEditMode) {
        await api.put(`/user-types/${id}`, formData);
      } else {
        await api.post('/user-types', formData);
      }
      navigate('/admin/user-types');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#9ca3af', fontSize: '14px' }}>
      Loading user type details...
    </div>
  );

  return (
    <div style={{ maxWidth: '560px', width: '100%' }}>

      {/* Back Link */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          to="/admin/user-types"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            backgroundColor: '#f3f4f6',
            padding: '8px 14px',
            borderRadius: '10px',
            textDecoration: 'none',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
          <ArrowLeft size={16} /> Back to Roles
        </Link>
      </div>

      {/* Page Title */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0', letterSpacing: '-0.025em' }}>
          {isEditMode ? 'Edit User Type' : 'Create New User Type'}
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', marginBottom: '0' }}>
          Define system roles for staff, receptionists, or clinic administrators.
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '14px 16px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* User Type Name */}
            <div>
              <label htmlFor="userType" style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
              }}>
                User Role / Type Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="userType"
                name="userType"
                type="text"
                required
                value={formData.userType}
                onChange={handleChange}
                placeholder="e.g., Staff Nurse, Receptionist, Doctor"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(249, 250, 251, 0.6)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#cc3b38';
                  e.target.style.boxShadow = '0 0 0 3px rgba(204,59,56,0.1)';
                  e.target.style.backgroundColor = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'rgba(249,250,251,0.6)';
                }}
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="isStatus" style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
              }}>
                Role Status
              </label>
              <select
                id="isStatus"
                name="isStatus"
                value={formData.isStatus}
                onChange={handleChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(249, 250, 251, 0.6)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#1f2937',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  appearance: 'none',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#cc3b38';
                  e.target.style.boxShadow = '0 0 0 3px rgba(204,59,56,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #f3f4f6',
          }}>
            <Link
              to="/admin/user-types"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4b5563',
                textDecoration: 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: saving ? '#e5e7eb' : '#cc3b38',
                color: saving ? '#9ca3af' : '#ffffff',
                padding: '10px 22px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#b52f2c'; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.backgroundColor = '#cc3b38'; }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save User Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserTypeForm;
