import { supabase } from '../utils/supabase';

// Helper to map DB snake_case to frontend camelCase
const mapServiceFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    icon: item.icon || '',
    description: item.description || '',
    whatsIncluded: Array.isArray(item.whats_included) ? item.whats_included : [],
    approach: item.approach || '',
    sortOrder: item.sort_order ?? 0,
    isStatus: item.is_status ?? 1,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

// Helper to map frontend camelCase to DB snake_case
const mapServiceToDb = (data) => {
  const mapped = {};
  if (data.name !== undefined) mapped.name = data.name;
  if (data.category !== undefined) mapped.category = data.category;
  if (data.icon !== undefined) mapped.icon = data.icon;
  if (data.description !== undefined) mapped.description = data.description;
  if (data.whatsIncluded !== undefined) mapped.whats_included = data.whatsIncluded;
  if (data.approach !== undefined) mapped.approach = data.approach;
  if (data.sortOrder !== undefined) mapped.sort_order = parseInt(data.sortOrder, 10) || 0;
  if (data.isStatus !== undefined) mapped.is_status = data.isStatus ? 1 : 0;
  mapped.updated_at = new Date().toISOString();
  return mapped;
};

export const servicesController = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(mapServiceFromDb);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();

    if (error) throw new Error(error.message);
    return mapServiceFromDb(data);
  },

  async create(serviceData) {
    const payload = mapServiceToDb(serviceData);
    delete payload.id;

    const { data, error } = await supabase
      .from('services')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapServiceFromDb(data);
  },

  async update(id, serviceData) {
    const payload = mapServiceToDb(serviceData);

    const { data, error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', parseInt(id, 10))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapServiceFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
