const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const conditions = await prisma.healthCondition.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    const result = conditions.map((c) => ({
      id: Number(c.id),
      title: c.title,
      category: c.category,
      icon: c.icon || '',
      shortSummary: c.short_summary || '',
      symptoms: Array.isArray(c.symptoms) ? c.symptoms : [],
      causes: Array.isArray(c.causes) ? c.causes : [],
      prevention: Array.isArray(c.prevention) ? c.prevention : [],
      whenToSeeDoctor: c.whenToSeeDoctor || '',
      sortOrder: c.sortOrder,
      isStatus: c.isStatus,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return sendSuccess(res, 'Health conditions fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const condition = await prisma.healthCondition.findUnique({
      where: { id: BigInt(req.params.id) },
    });

    if (!condition) return sendError(res, 'Health condition not found', 404);

    const result = {
      id: Number(condition.id),
      title: condition.title,
      category: condition.category,
      icon: condition.icon || '',
      shortSummary: condition.short_summary || '',
      symptoms: Array.isArray(condition.symptoms) ? condition.symptoms : [],
      causes: Array.isArray(condition.causes) ? condition.causes : [],
      prevention: Array.isArray(condition.prevention) ? condition.prevention : [],
      whenToSeeDoctor: condition.whenToSeeDoctor || '',
      sortOrder: condition.sortOrder,
      isStatus: condition.isStatus,
      createdAt: condition.createdAt,
      updatedAt: condition.updatedAt,
    };

    return sendSuccess(res, 'Health condition fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const condition = await prisma.healthCondition.create({
      data: {
        title: data.title,
        category: data.category,
        icon: data.icon || null,
        short_summary: data.shortSummary || null,
        symptoms: data.symptoms || [],
        causes: data.causes || [],
        prevention: data.prevention || [],
        whenToSeeDoctor: data.whenToSeeDoctor || null,
        sortOrder: parseInt(data.sortOrder, 10) || 0,
        isStatus: data.isStatus !== undefined ? (data.isStatus ? 1 : 0) : 1,
      },
    });

    const result = {
      id: Number(condition.id),
      title: condition.title,
      category: condition.category,
      icon: condition.icon || '',
      shortSummary: condition.short_summary || '',
      symptoms: Array.isArray(condition.symptoms) ? condition.symptoms : [],
      causes: Array.isArray(condition.causes) ? condition.causes : [],
      prevention: Array.isArray(condition.prevention) ? condition.prevention : [],
      whenToSeeDoctor: condition.whenToSeeDoctor || '',
      sortOrder: condition.sortOrder,
      isStatus: condition.isStatus,
      createdAt: condition.createdAt,
      updatedAt: condition.updatedAt,
    };

    return sendSuccess(res, 'Health condition created successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.shortSummary !== undefined) updateData.short_summary = data.shortSummary;
    if (data.symptoms !== undefined) updateData.symptoms = data.symptoms;
    if (data.causes !== undefined) updateData.causes = data.causes;
    if (data.prevention !== undefined) updateData.prevention = data.prevention;
    if (data.whenToSeeDoctor !== undefined) updateData.whenToSeeDoctor = data.whenToSeeDoctor;
    if (data.sortOrder !== undefined) updateData.sortOrder = parseInt(data.sortOrder, 10) || 0;
    if (data.isStatus !== undefined) updateData.isStatus = data.isStatus ? 1 : 0;

    const condition = await prisma.healthCondition.update({
      where: { id: BigInt(req.params.id) },
      data: updateData,
    });

    const result = {
      id: Number(condition.id),
      title: condition.title,
      category: condition.category,
      icon: condition.icon || '',
      shortSummary: condition.short_summary || '',
      symptoms: Array.isArray(condition.symptoms) ? condition.symptoms : [],
      causes: Array.isArray(condition.causes) ? condition.causes : [],
      prevention: Array.isArray(condition.prevention) ? condition.prevention : [],
      whenToSeeDoctor: condition.whenToSeeDoctor || '',
      sortOrder: condition.sortOrder,
      isStatus: condition.isStatus,
      createdAt: condition.createdAt,
      updatedAt: condition.updatedAt,
    };

    return sendSuccess(res, 'Health condition updated successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.healthCondition.delete({
      where: { id: BigInt(req.params.id) },
    });

    return sendSuccess(res, 'Health condition deleted successfully');
  } catch (error) {
    return sendError(res, error.message);
  }
};
