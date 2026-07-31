const fs = require('fs');
const path = require('path');

const routes = [
  { name: 'employees', table: 'employees', auth: true, admin: true, search: ['first_name', 'last_name', 'employee_code'] },
  { name: 'services', table: 'services', auth: false, admin: false, search: ['name', 'category'], public: true, slug: true },
  { name: 'projects', table: 'projects', auth: true, admin: false, search: ['name', 'location', 'client_name'], public: true, slug: true },
  { name: 'tasks', table: 'project_tasks', auth: true, admin: false, search: ['task_name'] },
  { name: 'quotes', table: 'quotes', auth: true, admin: false, search: ['quote_number'] },
  { name: 'contracts', table: 'contracts', auth: true, admin: false, search: ['contract_number', 'title'] },
  { name: 'invoices', table: 'invoices', auth: true, admin: false, search: ['invoice_number'] },
  { name: 'payments', table: 'payments', auth: true, admin: false, search: ['payment_number'] },
  { name: 'appointments', table: 'appointments', auth: true, admin: false, search: ['title'] },
  { name: 'messages', table: 'messages', auth: true, admin: false },
  { name: 'notifications', table: 'notifications', auth: true, admin: false },
  { name: 'materials', table: 'materials', auth: true, admin: false, search: ['name', 'category'], public: true },
  { name: 'inventory', table: 'inventory', auth: true, admin: true, search: ['batch_number'] },
  { name: 'suppliers', table: 'suppliers', auth: true, admin: false, search: ['name', 'company_name'] },
  { name: 'purchases', table: 'purchase_orders', auth: true, admin: true, search: ['po_number'] },
  { name: 'equipment', table: 'equipment', auth: true, admin: false, search: ['name', 'serial_number'] },
  { name: 'inspections', table: 'site_inspections', auth: true, admin: false },
  { name: 'reports', table: 'daily_reports', auth: true, admin: false },
  { name: 'issues', table: 'issues', auth: true, admin: false, search: ['title'] },
  { name: 'support', table: 'support_tickets', auth: true, admin: false, search: ['ticket_number', 'subject'] },
  { name: 'blog', table: 'blog_posts', auth: true, admin: false, search: ['title'], public: true, slug: true },
  { name: 'faqs', table: 'faqs', auth: true, admin: false, search: ['question'], public: true },
  { name: 'reviews', table: 'reviews', auth: true, admin: false },
  { name: 'testimonials', table: 'testimonials', auth: true, admin: false, public: true },
  { name: 'settings', table: 'settings', auth: true, admin: true },
  { name: 'analytics', table: null, auth: true, admin: true },
  { name: 'estimator', table: null, auth: false, public: true },
  { name: 'contact', table: 'contact_messages', auth: false, public: true },
];

const routeTemplate = (r) => `const router = require('express').Router();
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');

const controller = new BaseController('${r.table}', {
  searchFields: ${JSON.stringify(r.search || [])},
  allowedFields: ['*'],
  auditAction: '${r.name.slice(0, -1) || r.name}',
  ${r.slug ? "useSlug: true," : ""}
  ${r.slug ? "slugField: 'name'," : ""}
});

${r.public ? `router.get('/', (req, res, next) => controller.list(req, res, next));
router.get('/:id', (req, res, next) => controller.get(req, res, next));` : `router.get('/', authenticate, (req, res, next) => controller.list(req, res, next));
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));`}
${r.auth ? `router.post('/', authenticate, ${r.admin ? "authorize('Super Admin', 'Admin'), " : ""}(req, res, next) => controller.create(req, res, next));
router.put('/:id', authenticate, ${r.admin ? "authorize('Super Admin', 'Admin'), " : ""}(req, res, next) => controller.update(req, res, next));
router.delete('/:id', authenticate, ${r.admin ? "authorize('Super Admin', 'Admin'), " : ""}(req, res, next) => controller.delete(req, res, next));` : ''}

module.exports = router;
`;

const routesDir = path.join(__dirname, 'src', 'routes');
routes.forEach(r => {
  const filePath = path.join(routesDir, `${r.name}.js`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, routeTemplate(r));
    console.log(`Created: routes/${r.name}.js`);
  }
});

console.log('All route files generated!');
