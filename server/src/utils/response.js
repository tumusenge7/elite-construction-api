const success = (res, data = null, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const paginated = (res, data, total, page, limit, message = 'Data retrieved successfully') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const error = (res, message = 'Unable to complete request', statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { success, paginated, error };
