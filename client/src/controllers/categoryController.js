import { supabase } from '../utils/supabase';

// Only categories stored in the database table are bound
const LOCAL_STORAGE_KEY = 'sharnam_custom_categories';

const getLocalCategories = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
};

const saveLocalCategories = (cats) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cats));
  } catch {}
};

// Helper to map DB snake_case to frontend camelCase
const mapCategoryFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    icon: item.icon || 'category',
    description: item.description || '',
    sortOrder: item.sort_order ?? 0,
    isStatus: item.is_status ?? 1,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

// Helper to map frontend camelCase to DB snake_case
const mapCategoryToDb = (data) => {
  const mapped = {};
  if (data.name !== undefined) mapped.name = data.name;
  if (data.slug !== undefined) {
    mapped.slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  } else if (data.name) {
    mapped.slug = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  if (data.icon !== undefined) mapped.icon = data.icon;
  if (data.description !== undefined) mapped.description = data.description;
  if (data.sortOrder !== undefined) mapped.sort_order = parseInt(data.sortOrder, 10) || 0;
  if (data.isStatus !== undefined) mapped.is_status = data.isStatus ? 1 : 0;
  mapped.updated_at = new Date().toISOString();
  return mapped;
};

export const categoryController = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });

      // If queried successfully from database table, return ONLY records in the table
      if (!error && Array.isArray(data)) {
        return data.map(mapCategoryFromDb);
      }

      if (error) {
        console.warn('Supabase categories table query error, checking local:', error.message);
        return getLocalCategories();
      }
    } catch (err) {
      console.warn('Category fetch error, fallback to local categories:', err);
      return getLocalCategories();
    }
    return [];
  },

  async getActive() {
    const all = await this.getAll();
    return all.filter((c) => c.isStatus === 1);
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', parseInt(id, 10))
        .single();

      if (!error && data) {
        return mapCategoryFromDb(data);
      }
    } catch {}

    const localList = getLocalCategories();
    const found = localList.find((c) => String(c.id) === String(id));
    if (found) return found;
    throw new Error('Category not found');
  },

  async create(catData) {
    const payload = mapCategoryToDb(catData);
    if (!payload.name) throw new Error('Category name is required');
    if (!payload.slug) {
      payload.slug = payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return mapCategoryFromDb(data);
      }
    } catch {}

    // Fallback local creation
    const localList = getLocalCategories();
    const newId = localList.length > 0 ? Math.max(...localList.map((c) => Number(c.id))) + 1 : 1;
    const newCategory = {
      id: newId,
      name: payload.name,
      slug: payload.slug,
      icon: payload.icon || 'category',
      description: payload.description || '',
      sortOrder: payload.sort_order ?? 0,
      isStatus: payload.is_status ?? 1,
      createdAt: new Date().toISOString(),
    };
    const updatedList = [...localList, newCategory].sort((a, b) => a.sortOrder - b.sortOrder);
    saveLocalCategories(updatedList);
    return newCategory;
  },

  async update(id, catData) {
    const payload = mapCategoryToDb(catData);

    try {
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', parseInt(id, 10))
        .select()
        .single();

      if (!error && data) {
        return mapCategoryFromDb(data);
      }
    } catch {}

    // Fallback local update
    const localList = getLocalCategories();
    const index = localList.findIndex((c) => String(c.id) === String(id));
    if (index === -1) throw new Error('Category not found');

    const updated = {
      ...localList[index],
      ...catData,
      id: localList[index].id,
      slug: payload.slug || localList[index].slug,
      sortOrder: payload.sort_order ?? localList[index].sortOrder,
      isStatus: payload.is_status ?? localList[index].isStatus,
      updatedAt: new Date().toISOString(),
    };
    localList[index] = updated;
    saveLocalCategories(localList);
    return updated;
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', parseInt(id, 10));

      if (!error) return { id, deleted: true };
    } catch {}

    // Fallback local delete
    const localList = getLocalCategories();
    const filtered = localList.filter((c) => String(c.id) !== String(id));
    saveLocalCategories(filtered);
    return { id, deleted: true };
  },
};
