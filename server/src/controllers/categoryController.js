const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    const result = categories.map((c) => ({
      id: Number(c.id),
      name: c.name,
      slug: c.slug,
      icon: c.icon || 'category',
      description: c.description || '',
      sortOrder: c.sortOrder,
      isStatus: c.isStatus,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return sendSuccess(res, 'Categories fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: BigInt(req.params.id) },
    });

    if (!category) return sendError(res, 'Category not found', 404);

    const result = {
      id: Number(category.id),
      name: category.name,
      slug: category.slug,
      icon: category.icon || 'category',
      description: category.description || '',
      sortOrder: category.sortOrder,
      isStatus: category.isStatus,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    return sendSuccess(res, 'Category fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name) return sendError(res, 'Category name is required', 400);

    const slug = (data.slug || data.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        icon: data.icon || null,
        description: data.description || null,
        sortOrder: parseInt(data.sortOrder, 10) || 0,
        isStatus: data.isStatus !== undefined ? (data.isStatus ? 1 : 0) : 1,
      },
    });

    const result = {
      id: Number(category.id),
      name: category.name,
      slug: category.slug,
      icon: category.icon || 'category',
      description: category.description || '',
      sortOrder: category.sortOrder,
      isStatus: category.isStatus,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    return sendSuccess(res, 'Category created successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) {
      updateData.slug = data.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    } else if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.sortOrder !== undefined) updateData.sortOrder = parseInt(data.sortOrder, 10) || 0;
    if (data.isStatus !== undefined) updateData.isStatus = data.isStatus ? 1 : 0;

    const category = await prisma.category.update({
      where: { id: BigInt(req.params.id) },
      data: updateData,
    });

    const result = {
      id: Number(category.id),
      name: category.name,
      slug: category.slug,
      icon: category.icon || 'category',
      description: category.description || '',
      sortOrder: category.sortOrder,
      isStatus: category.isStatus,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    return sendSuccess(res, 'Category updated successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: BigInt(req.params.id) },
    });

    return sendSuccess(res, 'Category deleted successfully');
  } catch (error) {
    return sendError(res, error.message);
  }
};
