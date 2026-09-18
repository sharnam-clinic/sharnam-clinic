import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const RolePermissionForm = () => {
  const navigate = useNavigate();
  const { userTypeId } = useParams();
  
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserTypeId, setSelectedUserTypeId] = useState(userTypeId ? parseInt(userTypeId) : '');
  const [menus, setMenus] = useState([]);
  const [permissions, setPermissions] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const defaultModules = [
    { id: 1, menuName: 'Clinic Photos (Our Facility)' },
    { id: 2, menuName: 'Services & Treatments' },
    { id: 3, menuName: 'Health Conditions Directory' },
    { id: 4, menuName: 'Users Master' },
    { id: 5, menuName: 'User Types & Roles' },
    { id: 6, menuName: 'Role Permissions' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all active User Types
        const utRes = await api.get('/user-types');
        let availableUT = [];
        if (utRes.data.status && utRes.data.result?.length > 0) {
          availableUT = utRes.data.result;
        } else {
          availableUT = [
            { id: 1, userType: 'Super Admin' },
            { id: 2, userType: 'Clinic Staff' },
            { id: 3, userType: 'Doctor' },
          ];
        }
        setUserTypes(availableUT);
        
        // Auto select first role if none provided
        if (!userTypeId && availableUT.length > 0) {
          setSelectedUserTypeId(availableUT[0].id);
        }
        
        // Fetch all menus
        const menuRes = await api.get('/menus');
        const activeMenus = (menuRes.data.status && menuRes.data.result?.length > 0) 
          ? menuRes.data.result 
          : defaultModules;
          
        setMenus(activeMenus);
        const initialPerms = {};
        activeMenus.forEach(m => {
          initialPerms[m.id] = { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 };
        });
        setPermissions(initialPerms);
        
      } catch (err) {
        console.warn('Backend offline, loading default role permissions setup');
        const fallbackUT = [
          { id: 1, userType: 'Super Admin' },
          { id: 2, userType: 'Clinic Staff' },
          { id: 3, userType: 'Doctor' },
        ];
        setUserTypes(fallbackUT);
        if (!userTypeId) {
          setSelectedUserTypeId(1);
        }
        setMenus(defaultModules);
        const initialPerms = {};
        defaultModules.forEach(m => {
          initialPerms[m.id] = { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 };
        });
        setPermissions(initialPerms);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userTypeId]);

  // Fetch permissions when a UserType is selected
  useEffect(() => {
    if (!selectedUserTypeId) return;
    
    const fetchPermissions = async () => {
      try {
        const res = await api.get(`/permissions/${selectedUserTypeId}`);
        if (res.data.status && res.data.result?.length > 0) {
          setPermissions(prev => {
            const updated = { ...prev };
            res.data.result.forEach(p => {
              if (updated[p.menuId]) {
                updated[p.menuId] = {
                  isRead: p.isRead,
                  isWrite: p.isWrite,
                  isEdit: p.isEdit,
                  isDelete: p.isDelete
                };
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.warn('Using existing state permissions for role', err.message);
      }
    };
    
    fetchPermissions();
  }, [selectedUserTypeId]);

  const handleUserTypeChange = (e) => {
    const val = e.target.value;
    setSelectedUserTypeId(val ? parseInt(val) : '');
    setSuccess(null);
    setError(null);
  };

  const togglePermission = (menuId, field) => {
    setPermissions(prev => {
      const current = prev[menuId] || { isRead: 0, isWrite: 0, isEdit: 0, isDelete: 0 };
      const nextVal = current[field] === 1 ? 0 : 1;
      
      const updated = {
        ...current,
        [field]: nextVal
      };

      if (field === 'isRead' && nextVal === 0) {
        updated.isWrite = 0;
        updated.isEdit = 0;
        updated.isDelete = 0;
      }
      
      if ((field === 'isWrite' || field === 'isEdit' || field === 'isDelete') && nextVal === 1) {
        updated.isRead = 1;
      }

      return {
        ...prev,
        [menuId]: updated
      };
    });
  };

  const setAllPermissions = (val) => {
    setPermissions(prev => {
      const updated = {};
      menus.forEach(m => {
        updated[m.id] = { isRead: val, isWrite: val, isEdit: val, isDelete: val };
      });
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserTypeId) {
      setError('Please select a User Role');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      userTypeId: selectedUserTypeId,
      permissions: Object.entries(permissions).map(([menuId, perms]) => ({
        menuId: parseInt(menuId),
        ...perms
      }))
    };

    try {
      await api.post('/permissions/bulk', payload);
      setSuccess('Role permissions saved successfully!');
      toast.success('Role permissions saved successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save role permissions';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
        Loading role permissions matrix...
      </div>
    );
  }

  const currentRole = userTypes.find(ut => ut.id === selectedUserTypeId);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/admin/user-types"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#4b5563',
              textDecoration: 'none',
              transition: 'background-color 0.15s',
            }}
            title="Back to User Roles"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>
              Role & Module Permissions
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
              Configure granular access permissions for each user role in the clinic system.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !selectedUserTypeId}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#cc3b38',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving || !selectedUserTypeId ? 0.6 : 1,
            boxShadow: '0 1px 3px rgba(204,59,56,0.2)',
            transition: 'background-color 0.15s',
          }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Permissions'}
        </button>
      </div>

      {/* Main Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>

        {/* Notifications */}
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#dc2626',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            color: '#059669',
            fontSize: '14px',
            fontWeight: '600',
          }}>
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Role Selection & Quick Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '20px',
            marginBottom: '20px',
            borderBottom: '1px solid #f3f4f6',
          }}>
            <div style={{ flex: '1 1 300px', maxWidth: '420px' }}>
              <label 
                htmlFor="userRoleId" 
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                }}
              >
                Select User Role <span style={{ color: '#dc2626' }}>*</span>
              </label>
              
              <select
                id="userRoleId"
                value={selectedUserTypeId}
                onChange={handleUserTypeChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                <option value="">-- Choose User Role --</option>
                {userTypes.map(ut => (
                  <option key={ut.id} value={ut.id}>
                    {ut.userType} {ut.isStatus === 0 ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedUserTypeId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setAllPermissions(1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#059669',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    cursor: 'pointer',
                  }}
                >
                  <CheckSquare size={14} />
                  Grant All
                </button>
                <button
                  type="button"
                  onClick={() => setAllPermissions(0)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#4b5563',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                  }}
                >
                  <Square size={14} />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Permissions Matrix */}
          {selectedUserTypeId ? (
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '14px',
                  minWidth: '560px',
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#f9fafb',
                      borderBottom: '1px solid #e5e7eb',
                      color: '#4b5563',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      <th style={{ padding: '14px 18px' }}>Module Name</th>
                      <th style={{ padding: '14px 12px', textAlign: 'center', width: '100px' }}>Read</th>
                      <th style={{ padding: '14px 12px', textAlign: 'center', width: '100px' }}>Write</th>
                      <th style={{ padding: '14px 12px', textAlign: 'center', width: '100px' }}>Edit</th>
                      <th style={{ padding: '14px 12px', textAlign: 'center', width: '100px' }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((menu, idx) => {
                      const perms = permissions[menu.id] || { isRead: 0, isWrite: 0, isEdit: 0, isDelete: 0 };
                      const isEven = idx % 2 === 0;
                      
                      return (
                        <tr 
                          key={menu.id}
                          style={{
                            backgroundColor: isEven ? '#ffffff' : '#fafafa',
                            borderBottom: '1px solid #f3f4f6',
                            transition: 'background-color 0.15s',
                          }}
                        >
                          {/* Module Name */}
                          <td style={{ padding: '12px 18px', fontWeight: '500', color: '#1f2937' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ShieldCheck size={16} color="#cc3b38" />
                              <span>{menu.menuName}</span>
                            </div>
                          </td>

                          {/* Read Toggle */}
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={perms.isRead === 1}
                              onChange={() => togglePermission(menu.id, 'isRead')}
                              style={{
                                width: '18px',
                                height: '18px',
                                accentColor: '#cc3b38',
                                cursor: 'pointer',
                              }}
                            />
                          </td>

                          {/* Write Toggle */}
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              disabled={perms.isRead === 0}
                              checked={perms.isWrite === 1}
                              onChange={() => togglePermission(menu.id, 'isWrite')}
                              style={{
                                width: '18px',
                                height: '18px',
                                accentColor: '#cc3b38',
                                cursor: perms.isRead === 0 ? 'not-allowed' : 'pointer',
                                opacity: perms.isRead === 0 ? 0.3 : 1,
                              }}
                            />
                          </td>

                          {/* Edit Toggle */}
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              disabled={perms.isRead === 0}
                              checked={perms.isEdit === 1}
                              onChange={() => togglePermission(menu.id, 'isEdit')}
                              style={{
                                width: '18px',
                                height: '18px',
                                accentColor: '#cc3b38',
                                cursor: perms.isRead === 0 ? 'not-allowed' : 'pointer',
                                opacity: perms.isRead === 0 ? 0.3 : 1,
                              }}
                            />
                          </td>

                          {/* Delete Toggle */}
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              disabled={perms.isRead === 0}
                              checked={perms.isDelete === 1}
                              onChange={() => togglePermission(menu.id, 'isDelete')}
                              style={{
                                width: '18px',
                                height: '18px',
                                accentColor: '#cc3b38',
                                cursor: perms.isRead === 0 ? 'not-allowed' : 'pointer',
                                opacity: perms.isRead === 0 ? 0.3 : 1,
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px dashed #d1d5db',
            }}>
              <ShieldCheck size={36} color="#9ca3af" style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#374151', margin: 0 }}>
                No Role Selected
              </p>
              <p style={{ fontSize: '13px', margin: '4px 0 0 0' }}>
                Please choose a user role from the dropdown above to view and configure permissions.
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          {selectedUserTypeId && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #f3f4f6',
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Configuring role: <strong style={{ color: '#111827' }}>{currentRole?.userType || 'Selected Role'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to="/admin/user-types"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4b5563',
                    textDecoration: 'none',
                    backgroundColor: '#f3f4f6',
                  }}
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
                    backgroundColor: '#cc3b38',
                    color: '#ffffff',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    boxShadow: '0 1px 3px rgba(204,59,56,0.2)',
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Role Permissions'}
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};

export default RolePermissionForm;
