import { supabase } from '../utils/supabase';

const mapConditionFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    icon: item.icon || '',
    shortSummary: item.short_summary || '',
    symptoms: Array.isArray(item.symptoms) ? item.symptoms : [],
    causes: Array.isArray(item.causes) ? item.causes : [],
    prevention: Array.isArray(item.prevention) ? item.prevention : [],
    whenToSeeDoctor: item.when_to_see_doctor || '',
    sortOrder: item.sort_order ?? 0,
    isStatus: item.is_status ?? 1,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

const mapConditionToDb = (data) => {
  const mapped = {};
  if (data.title !== undefined) mapped.title = data.title;
  if (data.category !== undefined) mapped.category = data.category;
  if (data.icon !== undefined) mapped.icon = data.icon;
  if (data.shortSummary !== undefined) mapped.short_summary = data.shortSummary;
  if (data.symptoms !== undefined) mapped.symptoms = data.symptoms;
  if (data.causes !== undefined) mapped.causes = data.causes;
  if (data.prevention !== undefined) mapped.prevention = data.prevention;
  if (data.whenToSeeDoctor !== undefined) mapped.when_to_see_doctor = data.whenToSeeDoctor;
  if (data.sortOrder !== undefined) mapped.sort_order = parseInt(data.sortOrder, 10) || 0;
  if (data.isStatus !== undefined) mapped.is_status = data.isStatus ? 1 : 0;
  mapped.updated_at = new Date().toISOString();
  return mapped;
};

export const healthConditionsController = {
  async getAll() {
    const { data, error } = await supabase
      .from('health_conditions')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(mapConditionFromDb);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('health_conditions')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();

    if (error) throw new Error(error.message);
    return mapConditionFromDb(data);
  },

  async create(conditionData) {
    const payload = mapConditionToDb(conditionData);
    delete payload.id;

    const { data, error } = await supabase
      .from('health_conditions')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapConditionFromDb(data);
  },

  async update(id, conditionData) {
    const payload = mapConditionToDb(conditionData);

    const { data, error } = await supabase
      .from('health_conditions')
      .update(payload)
      .eq('id', parseInt(id, 10))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapConditionFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('health_conditions')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
