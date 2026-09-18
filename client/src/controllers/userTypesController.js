import { supabase } from '../utils/supabase';

const mapUserTypeFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    userType: item.user_type,
    isStatus: item.is_status ?? 1,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

export const userTypesController = {
  async getAll() {
    const { data, error } = await supabase
      .from('user_types')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(mapUserTypeFromDb);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('user_types')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();

    if (error) throw new Error(error.message);
    return mapUserTypeFromDb(data);
  },

  async create(typeData) {
    const payload = {
      user_type: typeData.userType,
      is_status: typeData.isStatus !== undefined ? (typeData.isStatus ? 1 : 0) : 1,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_types')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapUserTypeFromDb(data);
  },

  async update(id, typeData) {
    const payload = {
      ...(typeData.userType !== undefined && { user_type: typeData.userType }),
      ...(typeData.isStatus !== undefined && { is_status: typeData.isStatus ? 1 : 0 }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_types')
      .update(payload)
      .eq('id', parseInt(id, 10))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapUserTypeFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('user_types')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
