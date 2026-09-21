const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const photos = await prisma.clinicPhoto.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    const result = photos.map((p) => ({
      id: Number(p.id),
      title: p.title,
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      sortOrder: p.sortOrder,
      isStatus: p.isStatus,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return sendSuccess(res, 'Clinic photos fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const photo = await prisma.clinicPhoto.findUnique({
      where: { id: BigInt(req.params.id) },
    });

    if (!photo) return sendError(res, 'Clinic photo not found', 404);

    const result = {
      id: Number(photo.id),
      title: photo.title,
      description: photo.description || '',
      imageUrl: photo.imageUrl || '',
      sortOrder: photo.sortOrder,
      isStatus: photo.isStatus,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };

    return sendSuccess(res, 'Clinic photo fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const photo = await prisma.clinicPhoto.create({
      data: {
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl || '',
        sortOrder: parseInt(data.sortOrder, 10) || 0,
        isStatus: data.isStatus !== undefined ? (data.isStatus ? 1 : 0) : 1,
      },
    });

    const result = {
      id: Number(photo.id),
      title: photo.title,
      description: photo.description || '',
      imageUrl: photo.imageUrl || '',
      sortOrder: photo.sortOrder,
      isStatus: photo.isStatus,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };

    return sendSuccess(res, 'Clinic photo created successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.sortOrder !== undefined) updateData.sortOrder = parseInt(data.sortOrder, 10) || 0;
    if (data.isStatus !== undefined) updateData.isStatus = data.isStatus ? 1 : 0;

    const photo = await prisma.clinicPhoto.update({
      where: { id: BigInt(req.params.id) },
      data: updateData,
    });

    const result = {
      id: Number(photo.id),
      title: photo.title,
      description: photo.description || '',
      imageUrl: photo.imageUrl || '',
      sortOrder: photo.sortOrder,
      isStatus: photo.isStatus,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt,
    };

    return sendSuccess(res, 'Clinic photo updated successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.clinicPhoto.delete({
      where: { id: BigInt(req.params.id) },
    });

    return sendSuccess(res, 'Clinic photo deleted successfully');
  } catch (error) {
    return sendError(res, error.message);
  }
};
