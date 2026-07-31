const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const generateNumber = (prefix = '') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

const calculateProgress = (stages) => {
  if (!stages || stages.length === 0) return 0;
  const completed = stages.filter(s => s.status === 'completed').length;
  return Math.round((completed / stages.length) * 100);
};

const calculateRiskScore = (probability, impact) => {
  const probMap = { very_low: 1, low: 2, medium: 3, high: 4, very_high: 5 };
  const impactMap = { very_low: 1, low: 2, medium: 3, high: 4, very_high: 5 };
  const p = probMap[probability] || 3;
  const i = impactMap[impact] || 3;
  return p * i;
};

module.exports = { slugify, generateNumber, calculateProgress, calculateRiskScore };
