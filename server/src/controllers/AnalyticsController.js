const Customer = require('../models/Customer');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { success } = require('../utils/response');

exports.dashboard = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      activeProjects,
      completedProjects,
      pendingQuotes,
      approvedQuotes,
      outstandingInvoices,
      unreadMessages,
      upcomingAppointments,
      revenueResult,
    ] = await Promise.all([
      Customer.countDocuments(),
      Project.countDocuments({ status: { $nin: ['completed', 'cancelled'] } }),
      Project.countDocuments({ status: 'completed' }),
      Quote.countDocuments({ status: { $in: ['draft', 'sent'] } }),
      Quote.countDocuments({ status: 'accepted' }),
      Invoice.countDocuments({ status: { $in: ['sent', 'overdue'] } }),
      Message.countDocuments({ isRead: false }),
      Appointment.countDocuments({ status: 'approved', confirmedDate: { $gte: new Date() } }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    return success(res, {
      total_customers: totalCustomers,
      active_projects: activeProjects,
      completed_projects: completedProjects,
      pending_quotes: pendingQuotes,
      approved_quotes: approvedQuotes,
      outstanding_payments: outstandingInvoices,
      unread_messages: unreadMessages,
      upcoming_appointments: upcomingAppointments,
      total_revenue: revenueResult[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

exports.projectsByStatus = async (req, res, next) => {
  try {
    const data = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return success(res, data.map(d => ({ status: d._id, count: d.count })));
  } catch (err) {
    next(err);
  }
};

exports.revenueByMonth = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const data = await Payment.aggregate([
      { $match: { status: 'completed', paymentDate: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return success(res, data.map(d => ({ month: d._id, revenue: d.revenue })));
  } catch (err) {
    next(err);
  }
};

exports.quotesByMonth = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const data = await Quote.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
          value: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return success(res, data.map(d => ({ month: d._id, count: d.count, value: d.value })));
  } catch (err) {
    next(err);
  }
};

exports.serviceDemand = async (req, res, next) => {
  try {
    const data = await Project.aggregate([
      { $group: { _id: '$category', project_count: { $sum: 1 } } },
      { $sort: { project_count: -1 } },
      { $limit: 10 },
    ]);
    return success(res, data.map(d => ({ name: d._id, project_count: d.project_count })));
  } catch (err) {
    next(err);
  }
};
