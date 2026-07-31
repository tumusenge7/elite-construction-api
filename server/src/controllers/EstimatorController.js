const { z } = require('zod');
const EstimatorConfig = require('../models/EstimatorConfig');
const { success, error } = require('../utils/response');
const { logAudit } = require('../utils/audit');

const estimateSchema = z.object({
  project_type: z.string().min(1),
  building_type: z.string().optional(),
  location: z.string().optional(),
  floors: z.number().min(0).default(0),
  building_size: z.number().min(1, 'Building size is required'),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  roof_type: z.string().optional(),
  finishing_level: z.enum(['basic', 'standard', 'premium', 'luxury']).default('standard'),
  foundation_type: z.string().optional(),
  additional_services: z.array(z.string()).optional(),
});

const getConfig = async (key, defaultValue = null) => {
  try {
    const doc = await EstimatorConfig.findOne({ keyName: key });
    if (doc) {
      const val = doc.keyValue;
      if (!isNaN(val)) return parseFloat(val);
      return val;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

exports.calculate = async (req, res, next) => {
  try {
    const data = estimateSchema.parse(req.body);

    const costPerSqm = await getConfig('cost_per_sqm', 1500);
    const laborRate = await getConfig('labor_rate', 500);
    const materialRate = await getConfig('material_rate', 800);
    const locationMultiplier = await getConfig(`location_mult_${(data.location || 'default').toLowerCase()}`, 1.0);
    const finishingMultiplier = { basic: 0.8, standard: 1.0, premium: 1.5, luxury: 2.5 };
    const finishMult = finishingMultiplier[data.finishing_level] || 1.0;
    const contingency = await getConfig('contingency_percentage', 10);
    const floorsMultiplier = 1 + (Math.max(data.floors, 1) - 1) * 0.4;

    const baseCost = data.building_size * costPerSqm * floorsMultiplier;
    const locationCost = baseCost * (locationMultiplier - 1);
    const finishCost = baseCost * (finishMult - 1);
    const materialCost = data.building_size * materialRate;
    const laborCost = data.building_size * laborRate;

    const subtotal = baseCost + locationCost + finishCost + materialCost + laborCost;
    const contingencyAmount = subtotal * (contingency / 100);

    const lowEstimate = subtotal * 0.9;
    const highEstimate = subtotal * 1.15 + contingencyAmount;

    const durationMonths = Math.max(3, Math.ceil(data.building_size / 50) + (data.floors * 2));

    const breakdown = {
      materials: Math.round((materialCost / subtotal) * 100),
      labor: Math.round((laborCost / subtotal) * 100),
      equipment: 10,
      other: 5,
    };

    const totalPct = breakdown.materials + breakdown.labor + breakdown.equipment + breakdown.other;
    breakdown.other += 100 - totalPct;

    if (req.user) {
      await logAudit(req.user.id, 'estimate_calculated', 'Estimator', null, `Estimate for ${data.project_type}`, req);
    }

    return success(res, {
      low_estimate: Math.round(lowEstimate),
      high_estimate: Math.round(highEstimate),
      estimated_duration_min: durationMonths,
      estimated_duration_max: durationMonths + 2,
      breakdown,
      details: {
        building_size_sqm: data.building_size,
        floors: data.floors || 1,
        finishing_level: data.finishing_level,
        location_multiplier: locationMultiplier,
        contingency_percentage: contingency,
      },
      disclaimer: 'This is an indicative estimate, not a final quotation. A site assessment is required for an official quotation.',
    });
  } catch (err) {
    if (err instanceof z.ZodError) return error(res, 'Validation error', 400, err.errors);
    next(err);
  }
};

exports.getConfig = async (req, res, next) => {
  try {
    const configs = await EstimatorConfig.find().sort({ keyName: 1 });
    return success(res, configs);
  } catch (err) {
    next(err);
  }
};

exports.updateConfig = async (req, res, next) => {
  try {
    const { configs } = req.body;
    for (const [key, value] of Object.entries(configs)) {
      await EstimatorConfig.findOneAndUpdate(
        { keyName: key },
        { keyName: key, keyValue: String(value) },
        { upsert: true, new: true }
      );
    }
    await logAudit(req.user?.id, 'estimator_config_updated', 'EstimatorConfig', null, 'Estimator configuration updated', req);
    return success(res, null, 'Configuration updated');
  } catch (err) {
    next(err);
  }
};
