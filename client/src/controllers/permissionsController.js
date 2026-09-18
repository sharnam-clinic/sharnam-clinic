import { supabase } from '../utils/supabase';

export const permissionsController = {
  async getByUserTypeId(userTypeId) {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('user_type_id', userTypeId);

    if (error) throw new Error(error.message);

    return (data || []).map(p => ({
      id: p.id,
      userTypeId: p.user_type_id,
      menuId: p.menu_id,
      isRead: p.is_read,
      isWrite: p.is_write,
      isEdit: p.is_edit,
      isDelete: p.is_delete,
    }));
  },

  async saveBulk(userTypeId, permissionsList) {
    if (!userTypeId || !Array.isArray(permissionsList)) {
      throw new Error('Invalid userTypeId or permissions list');
    }

    const records = permissionsList.map(p => ({
      user_type_id: parseInt(userTypeId, 10),
      menu_id: parseInt(p.menuId, 10),
      is_read: p.isRead ? 1 : 0,
      is_write: p.isWrite ? 1 : 0,
      is_edit: p.isEdit ? 1 : 0,
      is_delete: p.isDelete ? 1 : 0,
      updated_at: new Date().toISOString(),
    }));

    // Upsert using the unique constraint (user_type_id, menu_id)
    const { data, error } = await supabase
      .from('role_permissions')
      .upsert(records, { onConflict: 'user_type_id, menu_id' })
      .select();

    if (error) throw new Error(error.message);
    return data;
  }
};
