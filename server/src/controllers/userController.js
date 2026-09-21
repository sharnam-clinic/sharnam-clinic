const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { userType: true },
      orderBy: { id: 'asc' },
    });

    const result = users.map((u) => ({
      id: Number(u.id),
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      password: u.password || '',
      userType: u.userTypeId ? Number(u.userTypeId) : null,
      userTypeRole: u.userType
        ? { id: Number(u.userType.id), userType: u.userType.user_type }
        : null,
      isStatus: u.isStatus,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return sendSuccess(res, 'Users fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(req.params.id) },
      include: { userType: true },
    });

    if (!user) return sendError(res, 'User not found', 404);

    const result = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: user.password || '',
      userType: user.userTypeId ? Number(user.userTypeId) : null,
      userTypeRole: user.userType
        ? { id: Number(user.userType.id), userType: user.userType.user_type }
        : null,
      isStatus: user.isStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return sendSuccess(res, 'User fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
        userTypeId: data.userType ? BigInt(data.userType) : BigInt(1),
        isStatus: data.isStatus !== undefined ? (data.isStatus ? 1 : 0) : 1,
      },
      include: { userType: true },
    });

    const result = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: user.password || '',
      userType: user.userTypeId ? Number(user.userTypeId) : null,
      userTypeRole: user.userType
        ? { id: Number(user.userType.id), userType: user.userType.user_type }
        : null,
      isStatus: user.isStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return sendSuccess(res, 'User created successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.password) updateData.password = data.password;
    if (data.userType !== undefined) updateData.userTypeId = BigInt(data.userType);
    if (data.isStatus !== undefined) updateData.isStatus = data.isStatus ? 1 : 0;

    const user = await prisma.user.update({
      where: { id: BigInt(req.params.id) },
      data: updateData,
      include: { userType: true },
    });

    const result = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: user.password || '',
      userType: user.userTypeId ? Number(user.userTypeId) : null,
      userTypeRole: user.userType
        ? { id: Number(user.userType.id), userType: user.userType.user_type }
        : null,
      isStatus: user.isStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return sendSuccess(res, 'User updated successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: BigInt(req.params.id) },
    });

    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    return sendError(res, error.message);
  }
};
