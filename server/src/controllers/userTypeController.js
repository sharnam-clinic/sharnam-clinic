const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const userTypes = await prisma.userType.findMany({
      orderBy: { id: 'asc' },
    });

    const loggedInUserTypeId = req.user?.userTypeId ? Number(req.user.userTypeId) : 1;

    // Filter out user types that are "higher" (lower ID) than the logged in user
    const filteredUserTypes = userTypes.filter(ut => Number(ut.id) >= loggedInUserTypeId);

    const result = filteredUserTypes.map((ut) => ({
      id: Number(ut.id),
      userType: ut.user_type,
      isStatus: ut.is_status,
      createdAt: ut.created_at,
      updatedAt: ut.updated_at,
    }));

    return sendSuccess(res, 'User types fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const userType = await prisma.userType.findUnique({
      where: { id: BigInt(req.params.id) },
    });

    if (!userType) return sendError(res, 'User type not found', 404);

    const result = {
      id: Number(userType.id),
      userType: userType.user_type,
      isStatus: userType.is_status,
      createdAt: userType.created_at,
      updatedAt: userType.updated_at,
    };

    return sendSuccess(res, 'User type fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const userType = await prisma.userType.create({
      data: {
        user_type: data.userType,
        is_status: data.isStatus !== undefined ? (data.isStatus ? 1 : 0) : 1,
        updated_at: new Date(),
      },
    });

    const result = {
      id: Number(userType.id),
      userType: userType.user_type,
      isStatus: userType.is_status,
      createdAt: userType.created_at,
      updatedAt: userType.updated_at,
    };

    return sendSuccess(res, 'User type created successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const updateData = { updated_at: new Date() };

    if (data.userType !== undefined) updateData.user_type = data.userType;
    if (data.isStatus !== undefined) updateData.is_status = data.isStatus ? 1 : 0;

    const userType = await prisma.userType.update({
      where: { id: BigInt(req.params.id) },
      data: updateData,
    });

    const result = {
      id: Number(userType.id),
      userType: userType.user_type,
      isStatus: userType.is_status,
      createdAt: userType.created_at,
      updatedAt: userType.updated_at,
    };

    return sendSuccess(res, 'User type updated successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.userType.delete({
      where: { id: BigInt(req.params.id) },
    });

    return sendSuccess(res, 'User type deleted successfully');
  } catch (error) {
    return sendError(res, error.message);
  }
};
