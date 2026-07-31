const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const Role = require('../models/Role');
const Session = require('../models/Session');
const config = require('../config');
const { success, error } = require('../utils/response');
const { logAudit } = require('../utils/audit');
const { createNotification } = require('../utils/notifications');

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role_id: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return error(res, 'Email already registered', 409);
    }

    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone || null,
      role: data.role_id || null,
    });

    const role = data.role_id ? await Role.findById(data.role_id) : null;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: role?.name || null },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    await logAudit(user._id, 'user_registered', 'User', user._id, 'User registered');

    createNotification({
      user: user._id,
      type: 'success',
      title: 'Welcome to Elite Construction!',
      message: `Your account has been created, ${data.first_name}. Complete your profile to get the most from your customer portal.`,
      data: { user_id: user._id },
    });

    return success(res, {
      token,
      user: { id: user._id, email: user.email, first_name: user.firstName, last_name: user.lastName },
    }, 'Registration successful', 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(res, 'Validation error', 400, err.errors);
    }
    if (err.name === 'ValidationError') {
      return error(res, 'Validation error', 400, Object.values(err.errors).map(e => e.message));
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email }).populate('role');
    if (!user) {
      return error(res, 'Invalid email or password', 401);
    }

    if (user.status !== 'active') {
      return error(res, 'Account is not active', 403);
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return error(res, 'Invalid email or password', 401);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const roleName = user.role?.name || null;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: roleName },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.create({
      user: user._id,
      token,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'],
      device: req.headers['user-agent']?.substring(0, 200),
      expiresAt,
    });

    await logAudit(user._id, 'user_login', 'User', user._id, 'User logged in', req);

    return success(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        role: roleName,
      },
    }, 'Login successful');
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(res, 'Validation error', 400, err.errors);
    }
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role').select('-password');
    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, {
      id: user._id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      status: user.status,
      last_login_at: user.lastLoginAt,
      created_at: user.createdAt,
      role: user.role?.name || null,
      role_id: user.role?._id || null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName: first_name, lastName: last_name, phone },
      { new: true, runValidators: true }
    );

    if (!user) return error(res, 'User not found', 404);

    await logAudit(req.user.id, 'profile_updated', 'User', req.user.id, 'Profile updated', req);

    return success(res, null, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (token) {
      await Session.updateOne({ token }, { isActive: false });
    }
    await logAudit(req.user?.id, 'user_logout', 'User', req.user?.id, 'User logged out', req);
    return success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 'User not found', 404);

    const valid = await bcrypt.compare(current_password, user.password);
    if (!valid) return error(res, 'Current password is incorrect', 400);

    user.password = await bcrypt.hash(new_password, 12);
    await user.save();

    await logAudit(req.user.id, 'password_changed', 'User', req.user.id, 'Password changed', req);

    return success(res, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};
