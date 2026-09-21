const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getByUserTypeId = async (req, res) => {
  try {
    const userTypeId = BigInt(req.params.userTypeId);

    const permissions = await prisma.rolePermission.findMany({
      where: { userTypeId },
    });

    const result = permissions.map((p) => ({
      id: Number(p.id),
      userTypeId: Number(p.userTypeId),
      menuId: Number(p.menuId),
      isRead: p.isRead,
      isWrite: p.isWrite,
      isEdit: p.isEdit,
      isDelete: p.isDelete,
    }));

    return sendSuccess(res, 'Permissions fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.saveBulk = async (req, res) => {
  try {
    const { userTypeId, permissions } = req.body;

    if (!userTypeId || !Array.isArray(permissions)) {
      return sendError(res, 'Invalid userTypeId or permissions list', 400);
    }

    // Use a transaction to upsert all permissions
    const results = await prisma.$transaction(
      permissions.map((p) =>
        prisma.rolePermission.upsert({
          where: {
            userTypeId_menuId: {
              userTypeId: BigInt(userTypeId),
              menuId: BigInt(p.menuId),
            },
          },
          update: {
            isRead: p.isRead ? 1 : 0,
            isWrite: p.isWrite ? 1 : 0,
            isEdit: p.isEdit ? 1 : 0,
            isDelete: p.isDelete ? 1 : 0,
            updated_at: new Date(),
          },
          create: {
            userTypeId: BigInt(userTypeId),
            menuId: BigInt(p.menuId),
            isRead: p.isRead ? 1 : 0,
            isWrite: p.isWrite ? 1 : 0,
            isEdit: p.isEdit ? 1 : 0,
            isDelete: p.isDelete ? 1 : 0,
          },
        })
      )
    );

    const result = results.map((p) => ({
      id: Number(p.id),
      userTypeId: Number(p.userTypeId),
      menuId: Number(p.menuId),
      isRead: p.isRead,
      isWrite: p.isWrite,
      isEdit: p.isEdit,
      isDelete: p.isDelete,
    }));

    return sendSuccess(res, 'Permissions saved successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};
