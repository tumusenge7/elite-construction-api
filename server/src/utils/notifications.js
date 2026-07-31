const Notification = require('../models/Notification');
const User = require('../models/User');
const Role = require('../models/Role');

const createNotification = async ({ user, type, title, message, data = {} }) => {
  try {
    return await Notification.create({ user, type, title, message, data });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

const notifyUsers = async ({ users, type, title, message, data = {} }) => {
  if (!users || users.length === 0) return;
  const notifications = users
    .filter(Boolean)
    .map((user) => ({ user, type, title, message, data }));
  if (notifications.length === 0) return;
  try {
    return await Notification.insertMany(notifications);
  } catch (err) {
    console.error('Failed to create notifications:', err.message);
  }
};

const notifyAdmins = async ({ type, title, message, data = {} }) => {
  try {
    const roles = await Role.find({ name: { $in: ['Super Admin', 'Admin'] } }).select('_id').lean();
    const roleIds = roles.map((r) => r._id);
    if (roleIds.length === 0) return;
    const users = await User.find({ role: { $in: roleIds }, status: 'active' }).select('_id').lean();
    return notifyUsers({ users: users.map((u) => u._id), type, title, message, data });
  } catch (err) {
    console.error('notifyAdmins failed:', err.message);
  }
};

module.exports = { createNotification, notifyUsers, notifyAdmins };
