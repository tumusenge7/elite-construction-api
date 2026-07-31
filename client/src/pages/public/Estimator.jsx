import { useState } from 'react';
import { Link } from 'react-router-dom';

const serviceRates = {
  residential: { label: 'Residential Construction', rate: 850 },
  commercial: { label: 'Commercial Construction', rate: 1100 },
  renovation: { label: 'Renovation & Remodeling', rate: 650 },
  infrastructure: { label: 'Infrastructure', rate: 950 },
  design: { label: 'Design & Engineering', rate: 200 },
};

const qualityMultipliers = { standard: 1, premium: 1.35, luxury: 1.8 };
const complexityMultipliers = { simple: 0.85, moderate: 1, complex: 1.3 };
const locationFactors = { 'kigali-city': 1, urban: 0.9, rural: 0.75, remote: 1.2 };

export default function Estimator() {
  const [form, setForm] = useState({
    serviceType: 'residential', squareMeters: 100, quality: 'standard',
    complexity: 'moderate', location: 'kigali-city', floors: 1,
    bedrooms: 3, bathrooms: 2, includeInterior: true, includeLandscaping: false,
  });
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const calculateEstimate = () => {
    const baseRate = serviceRates[form.serviceType]?.rate || 850;
    const size = Number(form.squareMeters) || 0;
    const quality = qualityMultipliers[form.quality] || 1;
    const complexity = complexityMultipliers[form.complexity] || 1;
    const location = locationFactors[form.location] || 1;
    const floorMultiplier = 1 + (Number(form.floors) - 1) * 0.15;
    const baseCost = size * baseRate * quality * complexity * location * floorMultiplier;
    const interiorCost = form.includeInterior ? baseCost * 0.25 : 0;
    const landscapingCost = form.includeLandscaping ? baseCost * 0.08 : 0;
    const contingency = baseCost * 0.1;
    const total = baseCost + interiorCost + landscapingCost + contingency;
    return {
      baseCost: Math.round(baseCost), interiorCost: Math.round(interiorCost),
      landscapingCost: Math.round(landscapingCost), contingency: Math.round(contingency),
      total: Math.round(total), costPerSqm: Math.round(baseCost / size),
      estimatedDuration: Math.round(size * 0.02 + Number(form.floors) * 2),
    };
  };

  const result = calculateEstimate();

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Cost Estimator</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Smart Cost Estimator</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Get an instant preliminary cost estimate for your construction project.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Project Parameters</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(serviceRates).map(([key, svc]) => (
                        <button key={key} type="button" onClick={() => setForm({ ...form, serviceType: key })}
                          className={`p-3 rounded-lg border text-sm font-medium ${form.serviceType === key ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                          {svc.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Area (m²)</label>
                      <input type="number" name="squareMeters" value={form.squareMeters} onChange={handleChange} min={10} max={10000} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
                      <input type="number" name="floors" value={form.floors} onChange={handleChange} min={1} max={50} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                      <select name="quality" value={form.quality} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                      <select name="complexity" value={form.complexity} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                        <option value="simple">Simple</option>
                        <option value="moderate">Moderate</option>
                        <option value="complex">Complex</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <select name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                        <option value="kigali-city">Kigali City</option>
                        <option value="urban">Urban Area</option>
                        <option value="rural">Rural Area</option>
                        <option value="remote">Remote Area</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="includeInterior" checked={form.includeInterior} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Interior Finishing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="includeLandscaping" checked={form.includeLandscaping} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">Landscaping</span>
                    </label>
                  </div>

                  <button onClick={() => setShowResults(true)} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Calculate Estimate
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className={`bg-white rounded-lg border p-6 sm:p-8 sticky top-24 ${showResults ? 'border-blue-600' : 'border-gray-200'}`}>
                {showResults ? (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Estimate</h2>
                    <div className="text-center mb-6 p-4 bg-gray-900 rounded-lg">
                      <p className="text-gray-300 text-sm">Estimated Total</p>
                      <p className="text-3xl sm:text-4xl font-bold text-blue-400">${result.total.toLocaleString()}</p>
                      <p className="text-gray-300 text-sm mt-1">~${result.costPerSqm.toLocaleString()}/m²</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600 text-sm">Base Construction</span><span className="font-semibold text-gray-900">${result.baseCost.toLocaleString()}</span></div>
                      {form.includeInterior && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600 text-sm">Interior Finishing</span><span className="font-semibold text-gray-900">${result.interiorCost.toLocaleString()}</span></div>}
                      {form.includeLandscaping && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600 text-sm">Landscaping</span><span className="font-semibold text-gray-900">${result.landscapingCost.toLocaleString()}</span></div>}
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600 text-sm">Contingency (10%)</span><span className="font-semibold text-gray-900">${result.contingency.toLocaleString()}</span></div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded-lg">
                      Duration: <strong className="text-gray-900">{result.estimatedDuration} months</strong>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">This is a preliminary estimate. Actual costs may vary.</p>
                    <Link to="/request-quote" className="block w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-center hover:bg-blue-700">
                      Get Detailed Quote
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Estimate Yet</h3>
                    <p className="text-gray-500 text-sm">Fill in your project parameters and click "Calculate Estimate".</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-sm font-medium text-gray-900 mb-1">Important Note</p>
            <p className="text-sm text-gray-600">This estimator provides a preliminary cost range based on industry averages. For an accurate quotation, please request a formal quote.</p>
          </div>
        </div>
      </section>
    </>
  );
}
