import { supabase } from '../utils/supabase';

const mapPhotoFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    imageUrl: item.image_url || '',
    sortOrder: item.sort_order ?? 0,
    isStatus: item.is_status ?? 1,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

const mapPhotoToDb = (data) => {
  const mapped = {};
  if (data.title !== undefined) mapped.title = data.title;
  if (data.description !== undefined) mapped.description = data.description;
  if (data.imageUrl !== undefined) mapped.image_url = data.imageUrl;
  if (data.sortOrder !== undefined) mapped.sort_order = parseInt(data.sortOrder, 10) || 0;
  if (data.isStatus !== undefined) mapped.is_status = data.isStatus ? 1 : 0;
  mapped.updated_at = new Date().toISOString();
  return mapped;
};

export const clinicPhotosController = {
  async getAll() {
    const { data, error } = await supabase
      .from('clinic_photos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map(mapPhotoFromDb);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('clinic_photos')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();

    if (error) throw new Error(error.message);
    return mapPhotoFromDb(data);
  },

  async create(photoData) {
    const payload = mapPhotoToDb(photoData);
    delete payload.id;

    const { data, error } = await supabase
      .from('clinic_photos')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapPhotoFromDb(data);
  },

  async update(id, photoData) {
    const payload = mapPhotoToDb(photoData);

    const { data, error } = await supabase
      .from('clinic_photos')
      .update(payload)
      .eq('id', parseInt(id, 10))
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapPhotoFromDb(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('clinic_photos')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw new Error(error.message);
    return { success: true };
  },

  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `facility/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('clinic-assets')
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from('clinic-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
