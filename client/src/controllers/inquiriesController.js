import { supabase } from '../utils/supabase';

const LOCAL_STORAGE_KEY = 'sharnam_patient_inquiries';

const getLocalInquiries = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
};

const saveLocalInquiries = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const mapInquiryFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email || '',
    subject: item.subject || 'General Inquiry',
    message: item.message || '',
    isRead: item.is_read ?? 0,
    createdAt: item.created_at,
  };
};

export const inquiriesController = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Merge any local fallback entries if any exist
        const local = getLocalInquiries();
        const existingIds = new Set(data.map((d) => String(d.id)));
        const unmergedLocal = local.filter((l) => !existingIds.has(String(l.id)));
        const combined = [...data.map(mapInquiryFromDb), ...unmergedLocal];
        return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (err) {
      console.warn('Supabase inquiries fetch error, using local fallback:', err);
    }
    return getLocalInquiries();
  },

  async create(data) {
    if (!data.name || !data.phone || !data.message) {
      throw new Error('Name, Phone, and Message are required.');
    }

    const payload = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: (data.email || '').trim(),
      subject: (data.subject || 'General Inquiry').trim(),
      message: data.message.trim(),
      is_read: 0,
      created_at: new Date().toISOString(),
    };

    try {
      const { data: inserted, error } = await supabase
        .from('inquiries')
        .insert([payload])
        .select()
        .single();

      if (!error && inserted) {
        return mapInquiryFromDb(inserted);
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving to local storage fallback:', err);
    }

    // Fallback save in local storage
    const local = getLocalInquiries();
    const newId = local.length > 0 ? Math.max(...local.map((i) => Number(i.id) || 0)) + 1 : 1;
    const newInquiry = {
      id: newId,
      ...payload,
      isRead: 0,
      createdAt: payload.created_at,
    };
    const updated = [newInquiry, ...local];
    saveLocalInquiries(updated);
    return newInquiry;
  },

  async markAsRead(id, isRead = 1) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ is_read: isRead })
        .eq('id', parseInt(id, 10));

      if (!error) return { id, isRead };
    } catch {}

    const local = getLocalInquiries();
    const index = local.findIndex((i) => String(i.id) === String(id));
    if (index !== -1) {
      local[index].isRead = isRead;
      saveLocalInquiries(local);
    }
    return { id, isRead };
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', parseInt(id, 10));

      if (!error) return { id, deleted: true };
    } catch {}

    const local = getLocalInquiries();
    const filtered = local.filter((i) => String(i.id) !== String(id));
    saveLocalInquiries(filtered);
    return { id, deleted: true };
  },
};
