import { supabase } from '../utils/supabase';

const mapMenuFromDb = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    menuName: item.menu_name,
    listPageRoute: item.list_page_route,
    formPageRoute: item.form_page_route || null,
    icon: item.icon || 'Folder',
    sortOrder: item.sort_order ?? 0,
    isStatus: item.is_status ?? 1,
    createdAt: item.created_at,
  };
};

// Virtual Categories menu item to ensure immediate presence
const CATEGORIES_MENU = {
  id: 8,
  menuName: 'Categories',
  listPageRoute: '/admin/categories',
  formPageRoute: '/admin/categories/new',
  icon: 'Tags',
  sortOrder: 1,
  isStatus: 1,
  userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 },
};

// Virtual Inquiries menu item to ensure immediate presence
const INQUIRIES_MENU = {
  id: 9,
  menuName: 'Patient Inquiries',
  listPageRoute: '/admin/inquiries',
  formPageRoute: null,
  icon: 'Inbox',
  sortOrder: 5,
  isStatus: 1,
  userPermission: { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 },
};

export const menusController = {
  async getAll() {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    // Omit Dashboard and map
    const mapped = (data || [])
      .filter((m) => m.menu_name?.toLowerCase() !== 'dashboard' && m.list_page_route !== '/admin')
      .map(mapMenuFromDb);

    // Ensure Categories is present
    if (!mapped.some((m) => m.listPageRoute === '/admin/categories')) {
      mapped.unshift({
        id: CATEGORIES_MENU.id,
        menuName: CATEGORIES_MENU.menuName,
        listPageRoute: CATEGORIES_MENU.listPageRoute,
        formPageRoute: CATEGORIES_MENU.formPageRoute,
        icon: CATEGORIES_MENU.icon,
        sortOrder: 1,
        isStatus: 1,
      });
    }

    // Ensure Inquiries is present
    if (!mapped.some((m) => m.listPageRoute === '/admin/inquiries')) {
      mapped.push({
        id: INQUIRIES_MENU.id,
        menuName: INQUIRIES_MENU.menuName,
        listPageRoute: INQUIRIES_MENU.listPageRoute,
        formPageRoute: INQUIRIES_MENU.formPageRoute,
        icon: INQUIRIES_MENU.icon,
        sortOrder: 5,
        isStatus: 1,
      });
    }

    return mapped;
  },

  async getMyMenus(userTypeId = 1) {
    // 1. Fetch all active menus
    const { data: allMenus, error: menuErr } = await supabase
      .from('menus')
      .select('*')
      .eq('is_status', 1)
      .order('sort_order', { ascending: true });

    if (menuErr) throw new Error(menuErr.message);

    // 2. Fetch permissions for the role
    const { data: perms, error: permErr } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('user_type_id', userTypeId);

    if (permErr) throw new Error(permErr.message);

    const permMap = new Map();
    (perms || []).forEach((p) => {
      permMap.set(Number(p.menu_id), {
        isRead: p.is_read,
        isWrite: p.is_write,
        isEdit: p.is_edit,
        isDelete: p.is_delete,
      });
    });

    // Default permissions for super admin (userTypeId 1) or full access
    const defaultPerm = { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 };

    // Filter out Dashboard
    const validMenus = (allMenus || []).filter(
      (m) => m.menu_name?.toLowerCase() !== 'dashboard' && m.list_page_route !== '/admin'
    );

    const result = validMenus.map((m) => {
      const userPerm =
        permMap.get(Number(m.id)) ||
        (userTypeId === 1 ? defaultPerm : { isRead: 0, isWrite: 0, isEdit: 0, isDelete: 0 });
      return {
        ...mapMenuFromDb(m),
        userPermission: userPerm,
      };
    }).filter((m) => m.userPermission.isRead === 1);

    // Ensure Categories menu item is always present and accessible
    if (!result.some((m) => m.listPageRoute === '/admin/categories')) {
      const catPerm = permMap.get(CATEGORIES_MENU.id) || defaultPerm;
      if (catPerm.isRead === 1 || userTypeId === 1) {
        result.unshift({
          ...CATEGORIES_MENU,
          userPermission: catPerm,
        });
      }
    }

    // Ensure Inquiries menu item is present and accessible
    if (!result.some((m) => m.listPageRoute === '/admin/inquiries')) {
      const inqPerm = permMap.get(INQUIRIES_MENU.id) || defaultPerm;
      if (inqPerm.isRead === 1 || userTypeId === 1) {
        result.push({
          ...INQUIRIES_MENU,
          userPermission: inqPerm,
        });
      }
    }

    return result;
  },
};
