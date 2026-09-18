import { supabase } from '../utils/supabase';

const mapUserFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone || '',
    password: item.password || '',
    userType: item.user_type_id,
    userTypeRole: item.user_types ? { id: item.user_types.id, userType: item.user_types.user_type } : null,
    isStatus: item.is_status ?? 1,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

export const usersController = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*, user_types(id, user_type)')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(mapUserFromDb);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*, user_types(id, user_type)')
      .eq('id', parseInt(id, 10))
      .single();

    if (error) throw new Error(error.message);
    return mapUserFromDb(data);
  },

  async create(userData) {
    const payload = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || null,
      password: userData.password,
      user_type_id: userData.userType ? parseInt(userData.userType, 10) : 1,
      is_status: userData.isStatus !== undefined ? (userData.isStatus ? 1 : 0) : 1,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert([payload])
      .select('*, user_types(id, user_type)')
      .single();

    if (error) throw new Error(error.message);
    return mapUserFromDb(data);
  },

  async update(id, userData) {
    const payload = {
      ...(userData.name !== undefined && { name: userData.name }),
      ...(userData.email !== undefined && { email: userData.email }),
      ...(userData.phone !== undefined && { phone: userData.phone }),
      ...(userData.password && { password: userData.password }),
      ...(userData.userType !== undefined && { user_type_id: parseInt(userData.userType, 10) }),
      ...(userData.isStatus !== undefined && { is_status: userData.isStatus ? 1 : 0 }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', parseInt(id, 10))
      .select('*, user_types(id, user_type)')
      .single();

    if (error) throw new Error(error.message);
    return mapUserFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
