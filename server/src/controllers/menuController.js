const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

// Virtual menu items to ensure they always exist
const CATEGORIES_MENU = {
  id: 8,
  menuName: 'Categories',
  listPageRoute: '/admin/categories',
  formPageRoute: '/admin/categories/new',
  icon: 'Tags',
  sortOrder: 1,
  isStatus: 1,
};

const INQUIRIES_MENU = {
  id: 9,
  menuName: 'Patient Inquiries',
  listPageRoute: '/admin/inquiries',
  formPageRoute: null,
  icon: 'Inbox',
  sortOrder: 5,
  isStatus: 1,
};

const mapMenu = (m) => ({
  id: Number(m.id),
  menuName: m.menuName,
  listPageRoute: m.listPageRoute,
  formPageRoute: m.formPageRoute || null,
  icon: m.icon || 'Folder',
  sortOrder: m.sortOrder,
  isStatus: m.isStatus,
  createdAt: m.created_at,
});

exports.getAll = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    // Filter out Dashboard
    let result = menus
      .filter((m) => m.menuName?.toLowerCase() !== 'dashboard' && m.listPageRoute !== '/admin')
      .map(mapMenu);

    // Ensure Categories is present
    if (!result.some((m) => m.listPageRoute === '/admin/categories')) {
      result.unshift(CATEGORIES_MENU);
    }

    // Ensure Inquiries is present
    if (!result.some((m) => m.listPageRoute === '/admin/inquiries')) {
      result.push(INQUIRIES_MENU);
    }

    return sendSuccess(res, 'Menus fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getMyMenus = async (req, res) => {
  try {
    // Get userTypeId from the authenticated user or query param
    const userTypeId = req.query.userTypeId
      ? BigInt(req.query.userTypeId)
      : req.user?.userTypeId
        ? BigInt(req.user.userTypeId)
        : BigInt(1);

    // 1. Fetch all active menus
    const allMenus = await prisma.menu.findMany({
      where: { isStatus: 1 },
      orderBy: [{ sortOrder: 'asc' }],
    });

    // 2. Fetch permissions for the role
    const perms = await prisma.rolePermission.findMany({
      where: { userTypeId },
    });

    const permMap = new Map();
    perms.forEach((p) => {
      permMap.set(Number(p.menuId), {
        isRead: p.isRead,
        isWrite: p.isWrite,
        isEdit: p.isEdit,
        isDelete: p.isDelete,
      });
    });

    const defaultPerm = { isRead: 1, isWrite: 1, isEdit: 1, isDelete: 1 };
    const noPerm = { isRead: 0, isWrite: 0, isEdit: 0, isDelete: 0 };

    // Filter out Dashboard
    const validMenus = allMenus.filter(
      (m) => m.menuName?.toLowerCase() !== 'dashboard' && m.listPageRoute !== '/admin'
    );

    const result = validMenus
      .map((m) => {
        const userPerm =
          permMap.get(Number(m.id)) ||
          (Number(userTypeId) === 1 ? defaultPerm : noPerm);
        return {
          ...mapMenu(m),
          userPermission: userPerm,
        };
      })
      .filter((m) => m.userPermission.isRead === 1);

    // Ensure Categories is present
    if (!result.some((m) => m.listPageRoute === '/admin/categories')) {
      const catPerm = permMap.get(CATEGORIES_MENU.id) || defaultPerm;
      if (catPerm.isRead === 1 || Number(userTypeId) === 1) {
        result.unshift({ ...CATEGORIES_MENU, userPermission: catPerm });
      }
    }

    // Ensure Inquiries is present
    if (!result.some((m) => m.listPageRoute === '/admin/inquiries')) {
      const inqPerm = permMap.get(INQUIRIES_MENU.id) || defaultPerm;
      if (inqPerm.isRead === 1 || Number(userTypeId) === 1) {
        result.push({ ...INQUIRIES_MENU, userPermission: inqPerm });
      }
    }

    return sendSuccess(res, 'My menus fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};
