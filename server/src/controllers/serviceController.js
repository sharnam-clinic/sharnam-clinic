const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    const result = services.map((s) => ({
      id: Number(s.id),
      name: s.name,
      category: s.category,
      icon: s.icon || '',
      description: s.description || '',
      whatsIncluded: Array.isArray(s.whats_included) ? s.whats_included : [],
      approach: s.approach || '',
      sortOrder: s.sortOrder,
      isStatus: s.isStatus,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return sendSuccess(res, 'Services fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: BigInt(req.params.id) },
    });

    if (!service) return sendError(res, 'Service not found', 404);

    const result = {
      id: Number(service.id),
      name: service.name,
      category: service.category,
      icon: service.icon || '',
      description: service.description || '',
      whatsIncluded: Array.isArray(service.whats_included) ? service.whats_included : [],
      approach: service.approach || '',
      sortOrder: service.sortOrder,
      isStatus: service.isStatus,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return sendSuccess(res, 'Service fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const service = await prisma.service.create({
      data: {
        name: data.name,
        category: data.category,
        icon: data.icon || null,
        description: data.description || null,
        whats_included: data.whatsIncluded || [],
        approach: data.approach || null,
        sortOrder: parseInt(data.sortOrder, 10) || 0,
        isStatus: data.isStatus !== undefined ? (data.isStatus ? 1 : 0) : 1,
      },
    });

    const result = {
      id: Number(service.id),
      name: service.name,
      category: service.category,
      icon: service.icon || '',
      description: service.description || '',
      whatsIncluded: Array.isArray(service.whats_included) ? service.whats_included : [],
      approach: service.approach || '',
      sortOrder: service.sortOrder,
      isStatus: service.isStatus,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return sendSuccess(res, 'Service created successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.whatsIncluded !== undefined) updateData.whats_included = data.whatsIncluded;
    if (data.approach !== undefined) updateData.approach = data.approach;
    if (data.sortOrder !== undefined) updateData.sortOrder = parseInt(data.sortOrder, 10) || 0;
    if (data.isStatus !== undefined) updateData.isStatus = data.isStatus ? 1 : 0;

    const service = await prisma.service.update({
      where: { id: BigInt(req.params.id) },
      data: updateData,
    });

    const result = {
      id: Number(service.id),
      name: service.name,
      category: service.category,
      icon: service.icon || '',
      description: service.description || '',
      whatsIncluded: Array.isArray(service.whats_included) ? service.whats_included : [],
      approach: service.approach || '',
      sortOrder: service.sortOrder,
      isStatus: service.isStatus,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    return sendSuccess(res, 'Service updated successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: BigInt(req.params.id) },
    });

    return sendSuccess(res, 'Service deleted successfully');
  } catch (error) {
    return sendError(res, error.message);
  }
};
