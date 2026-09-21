const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const result = inquiries.map((i) => ({
      id: Number(i.id),
      name: i.name,
      phone: i.phone,
      email: i.email || '',
      subject: i.subject || 'General Inquiry',
      message: i.message || '',
      isRead: i.isRead,
      createdAt: i.createdAt,
    }));

    return sendSuccess(res, 'Inquiries fetched successfully', result);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.phone || !data.message) {
      return sendError(res, 'Name, Phone, and Message are required.', 400);
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: (data.email || '').trim() || null,
        subject: (data.subject || 'General Inquiry').trim(),
        message: data.message.trim(),
        isRead: 0,
      },
    });

    const result = {
      id: Number(inquiry.id),
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email || '',
      subject: inquiry.subject,
      message: inquiry.message,
      isRead: inquiry.isRead,
      createdAt: inquiry.createdAt,
    };

    return sendSuccess(res, 'Inquiry submitted successfully', result, 201);
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const isRead = req.body.isRead !== undefined ? req.body.isRead : 1;

    await prisma.inquiry.update({
      where: { id: BigInt(req.params.id) },
      data: { isRead },
    });

    return sendSuccess(res, 'Inquiry marked as read', { id: req.params.id, isRead });
  } catch (error) {
    return sendError(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.inquiry.delete({
      where: { id: BigInt(req.params.id) },
    });

    return sendSuccess(res, 'Inquiry deleted successfully');
  } catch (error) {
    return sendError(res, error.message);
  }
};
