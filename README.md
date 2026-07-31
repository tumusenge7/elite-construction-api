# 🏗️ Elite Construction Platform

**Building Excellence. Delivering Trust.**

A modern, full-stack construction services platform combining a professional company website, customer portal, project management system, CRM, quotation engine, and construction management ERP.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Seed Data](#seed-data)
- [API Documentation](#api-documentation)
- [Roles & Permissions](#roles--permissions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Backup & Security](#backup--security)
- [Troubleshooting](#troubleshooting)

---

## 📖 Overview

Elite Construction is a comprehensive construction management ecosystem with three major experiences:

| Experience | Description |
|---|---|
| **Public Website** | Professional company website with services, portfolio, estimator, blog, and lead generation |
| **Customer Portal** | Secure client area for project tracking, quotes, invoices, documents, and communication |
| **Admin Dashboard** | Full administrative panel with CRM, project management, finance, procurement, HR, and analytics |

### Key Differentiators

1. **Smart Construction Estimator** - Get indicative project estimates instantly
2. **Project Progress Portal** - Real-time construction tracking for clients
3. **Digital Quote Workflow** - Quote → review → accept → contract → project
4. **Interactive Timeline** - Visual project stage progression
5. **Before/After Gallery** - Perfect for renovation showcases
6. **Site Visit Booking** - Online appointment scheduling
7. **Material & Inventory Management** - Track construction materials
8. **Equipment Tracking** - Manage machinery and maintenance
9. **Daily Site Reports** - Digital construction documentation
10. **Project Health Score** - Monitor schedule, budget, risks, quality
11. **AI Assistant** - Customer and internal AI tools
12. **Customer Messaging** - Secure customer ↔ project manager communication
13. **Document Center** - Secure document management per project
14. **Multi-language Ready** - English, Kinyarwanda, French support
15. **Advanced Analytics** - Business intelligence dashboard

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React SPA (Vite)                        │
│  React Router · Tailwind CSS · TanStack Query · Axios      │
│  Framer Motion · Recharts · Lucide Icons                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js API Server                     │
│  JWT Auth · Helmet · Rate Limiting · Multer · Zod          │
│  Controllers → Services → Repositories                     │
└──────────────────────────┬──────────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB 7+ Database                      │
│  40+ Collections · Indexes · Aggregation Pipeline          │
│  Flexible Schema                                           │
└─────────────────────────────────────────────────────────────┘
```

### Design Philosophy

- **Clean Architecture** - Separation of concerns with controllers, services, and data access layers
- **RESTful API** - Consistent, predictable API design
- **Role-Based Access** - Authorization enforced on both frontend and backend
- **Security First** - JWT authentication, input validation, rate limiting
- **Extensible** - Provider-based architecture for AI, payments, SMS, maps, and email services
- **Scalable** - Designed for multi-company, multi-branch support

---

## ✨ Features

### Public Website
- Premium hero section with animated statistics
- Quick action panel for service selection
- Service catalog with categories and details
- Project portfolio with filtering
- Interactive project timeline
- Smart construction cost estimator
- Blog/Insights section
- Team showcase
- Contact form
- FAQ system
- Testimonials
- Multi-language ready
- SEO optimized
- PWA enabled

### Customer Portal
- Secure login/registration
- Dashboard with project overview
- Project progress tracking
- Quote viewing and acceptance
- Invoice viewing and payment tracking
- Document center
- Appointment booking
- Secure messaging
- Notification center
- Profile management
- Support tickets

### Admin Dashboard
- Complete CRM (customers, leads, messages)
- Project management with Gantt-style tasks
- Financial management (quotes, contracts, invoices, payments)
- Procurement (materials, inventory, suppliers, purchase orders)
- Resource management (employees, equipment)
- Content management (services, projects, blog, testimonials, FAQs)
- Communication (messaging, notifications, appointments)
- Analytics and reporting
- System settings
- Audit logs
- User and role management

---

## 💻 Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool / dev server |
| Tailwind CSS 4 | Utility-first styling |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| TanStack React Query | Server state management |
| React Hook Form | Form management |
| Zod | Schema validation |
| Framer Motion | Animations |
| Recharts | Charts and graphs |
| Lucide React | Icons |
| Leaflet/React-Leaflet | Maps (configurable) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Multer | File uploads |
| Helmet | Security headers |
| Morgan | Logging |
| express-rate-limit | Rate limiting |
| Zod | Input validation |
| PDFKit | PDF generation |
| Nodemailer | Email sending |

---

## 📁 Project Structure

```
elite-construction/
├── client/                          # React Frontend
│   ├── public/
│   │   ├── icons/                   # PWA icons
│   │   ├── manifest.json            # PWA manifest
│   │   ├── robots.txt               # SEO
│   │   ├── offline.html             # Offline page
│   │   └── vite.svg                 # Favicon
│   └── src/
│       ├── components/
│       │   ├── layout/              # Navbar, Footer
│       │   ├── ui/                  # Reusable UI components
│       │   ├── services/            # Service components
│       │   ├── projects/            # Project components
│       │   └── estimator/           # Estimator components
│       ├── pages/
│       │   ├── public/              # Public website pages
│       │   │   ├── Home.jsx
│       │   │   ├── About.jsx
│       │   │   ├── Services.jsx
│       │   │   ├── ServiceDetail.jsx
│       │   │   ├── Projects.jsx
│       │   │   ├── ProjectDetail.jsx
│       │   │   ├── HowWeWork.jsx
│       │   │   ├── Team.jsx
│       │   │   ├── Insights.jsx
│       │   │   ├── InsightDetail.jsx
│       │   │   ├── Contact.jsx
│       │   │   ├── RequestQuote.jsx
│       │   │   ├── Estimator.jsx
│       │   │   ├── Login.jsx
│       │   │   └── NotFound.jsx
│       │   ├── admin/               # Admin pages
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Customers.jsx
│       │   │   ├── Projects.jsx
│       │   │   ├── Quotes.jsx
│       │   │   ├── Invoices.jsx
│       │   │   └── Settings.jsx
│       │   └── customer/            # Customer portal pages
│       │       ├── Dashboard.jsx
│       │       ├── Projects.jsx
│       │       ├── Quotes.jsx
│       │       └── Invoices.jsx
│       ├── layouts/
│       │   ├── PublicLayout.jsx
│       │   ├── AdminLayout.jsx
│       │   └── CustomerLayout.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js               # Axios API client
│       ├── hooks/
│       ├── utils/
│       ├── config/
│       ├── constants/
│       ├── locales/
│       ├── assets/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/                          # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js            # App configuration
│   │   │   └── database.js         # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── BaseController.js   # Generic CRUD controller
│   │   │   ├── AuthController.js
│   │   │   ├── ContactController.js
│   │   │   ├── EstimatorController.js
│   │   │   └── AnalyticsController.js
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT authentication
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── upload.js           # File upload config
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── customers.js
│   │   │   ├── employees.js
│   │   │   ├── services.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   ├── quotes.js
│   │   │   ├── contracts.js
│   │   │   ├── invoices.js
│   │   │   ├── payments.js
│   │   │   ├── appointments.js
│   │   │   ├── messages.js
│   │   │   ├── notifications.js
│   │   │   ├── materials.js
│   │   │   ├── inventory.js
│   │   │   ├── suppliers.js
│   │   │   ├── purchases.js
│   │   │   ├── equipment.js
│   │   │   ├── inspections.js
│   │   │   ├── reports.js
│   │   │   ├── issues.js
│   │   │   ├── support.js
│   │   │   ├── blog.js
│   │   │   ├── faqs.js
│   │   │   ├── reviews.js
│   │   │   ├── testimonials.js
│   │   │   ├── settings.js
│   │   │   ├── analytics.js
│   │   │   ├── uploads.js
│   │   │   ├── contact.js
│   │   │   └── estimator.js
│   │   ├── utils/
│   │   │   ├── response.js         # Standard response helpers
│   │   │   ├── audit.js            # Audit logging
│   │   │   └── helpers.js          # Utility functions
│   │   ├── index.js                # Server entry point
│   │   ├── migrate.js              # Database migration
│   │   └── seed.js                 # Development seed data
│   ├── uploads/                    # File upload directory
│   ├── .env
│   └── package.json
│
├── .env.example                    # Environment template
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** 7+ (or MongoDB Atlas URI)
- **npm** 9+

### Step 1: Clone & Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Environment Configuration

Copy `.env.example` to `server/.env` and configure:

```bash
cp .env.example server/.env
```

Edit `server/.env` with your MongoDB connection and other settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elite_construction
JWT_SECRET=your_random_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Step 3: Database Setup

Ensure MongoDB is running, then the server will connect automatically on first start.

### Step 4: Seed Development Data (Optional)

```bash
cd server
npm run seed
```

This populates the database with sample data including:
- 5 user accounts with different roles
- 5 customers
- 5 employees
- 10 services
- 8 projects
- Sample stages, tasks, materials, inventory, suppliers, equipment, testimonials, FAQs, blog posts, and settings

**Demo Credentials:**

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@eliteconstruction.com | password123 |
| Project Manager | manager@eliteconstruction.com | password123 |
| Engineer | engineer@eliteconstruction.com | password123 |
| Accountant | accountant@eliteconstruction.com | password123 |
| Procurement | procurement@eliteconstruction.com | password123 |

---

## 🏃 Running the Application

### Development Mode

**Start the backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Start the frontend:**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend automatically.

### Production Build

```bash
cd client
npm run build
cd ../server
npm start
```

---

## 🔌 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production:  https://your-domain.com/api
```

### Authentication

Most endpoints require a Bearer JWT token:

```
Authorization: Bearer <your_token>
```

### Endpoints

| Group | Endpoints | Auth Required |
|---|---|---|
| **Auth** | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/profile`, `PUT /api/auth/profile`, `PUT /api/auth/change-password` | Varies |
| **Users** | `GET/POST/PUT/DELETE /api/users` | Yes |
| **Customers** | `GET/POST/PUT/DELETE /api/customers` | Yes |
| **Employees** | `GET/POST/PUT/DELETE /api/employees` | Yes |
| **Services** | `GET/POST/PUT/DELETE /api/services` | Public GET |
| **Projects** | `GET/POST/PUT/DELETE /api/projects` | Public GET |
| **Tasks** | `GET/POST/PUT/DELETE /api/tasks` | Yes |
| **Quotes** | `GET/POST/PUT/DELETE /api/quotes` | Yes |
| **Contracts** | `GET/POST/PUT/DELETE /api/contracts` | Yes |
| **Invoices** | `GET/POST/PUT/DELETE /api/invoices` | Yes |
| **Payments** | `GET/POST/PUT/DELETE /api/payments` | Yes |
| **Appointments** | `GET/POST/PUT/DELETE /api/appointments` | Yes |
| **Messages** | `GET/POST/PUT/DELETE /api/messages` | Yes |
| **Notifications** | `GET/POST/PUT/DELETE /api/notifications` | Yes |
| **Materials** | `GET/POST/PUT/DELETE /api/materials` | Yes |
| **Inventory** | `GET/POST/PUT/DELETE /api/inventory` | Yes |
| **Suppliers** | `GET/POST/PUT/DELETE /api/suppliers` | Yes |
| **Purchases** | `GET/POST/PUT/DELETE /api/purchases` | Yes |
| **Equipment** | `GET/POST/PUT/DELETE /api/equipment` | Yes |
| **Inspections** | `GET/POST/PUT/DELETE /api/inspections` | Yes |
| **Reports** | `GET/POST/PUT/DELETE /api/reports` | Yes |
| **Issues** | `GET/POST/PUT/DELETE /api/issues` | Yes |
| **Support** | `GET/POST/PUT/DELETE /api/support` | Yes |
| **Blog** | `GET/POST/PUT/DELETE /api/blog` | Public GET |
| **FAQs** | `GET/POST/PUT/DELETE /api/faqs` | Public GET |
| **Testimonials** | `GET/POST/PUT/DELETE /api/testimonials` | Public GET |
| **Contact** | `POST /api/contact` | Public |
| **Estimator** | `POST /api/estimator/calculate` | Public |
| **Analytics** | `GET /api/analytics/dashboard` | Yes |
| **Uploads** | `POST /api/uploads` | Yes |

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Unable to complete request",
  "errors": []
}
```

**Paginated:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## 👥 Roles & Permissions

| Role | Description | Access Level |
|---|---|---|
| **Super Admin** | Full system access | All modules |
| **Admin** | Administrative access | Most modules |
| **Project Manager** | Project management access | Projects, tasks, team |
| **Engineer** | Engineering module access | Technical modules |
| **Accountant** | Financial system access | Quotes, invoices, payments |
| **Procurement Officer** | Procurement access | Materials, suppliers, purchases |
| **Site Supervisor** | Site operations access | Daily reports, inspections |
| **Customer** | Customer portal access | Own projects, quotes, invoices |

Authorization is enforced on both the frontend (route protection) and backend (middleware).

---

## 📊 Database Schema

The database contains 40+ tables covering:

- **Users & Auth** - users, roles, permissions, role_permissions
- **Customers** - customers, referrals
- **Employees** - employees
- **Services** - services, service_images
- **Projects** - projects, project_images, project_stages, project_tasks, project_updates, project_documents, project_risks
- **Finance** - quotes, quote_items, contracts, invoices, invoice_items, payments, change_requests
- **CRM** - appointments, messages, notifications, contact_messages, support_tickets, ticket_replies
- **Procurement** - materials, inventory, suppliers, purchase_requests, purchase_orders, purchase_order_items
- **Equipment** - equipment, equipment_maintenance
- **Operations** - site_inspections, daily_reports, safety_incidents, issues
- **Content** - blog_posts, blog_categories, faqs, testimonials, reviews
- **System** - settings, estimator_config, audit_logs

All tables use InnoDB engine with proper foreign keys, indexes, and UTF-8 MB4 encoding.

---

## 🧪 Testing

### Backend Testing

```bash
cd server
npm test
```

Test areas:
- Authentication (login, register, token validation)
- Authorization (role-based access control)
- CRUD operations for all entities
- Input validation
- Quote calculations
- File uploads
- Security (XSS, rate limiting)

### Frontend Testing

```bash
cd client
npm test
```

Test areas:
- Form validation
- Routing
- Protected routes
- API integration
- Responsive design

---

## 🌐 Deployment

### VPS / Dedicated Server

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Set up production environment variables** in `server/.env`

3. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   cd server
   pm2 start src/index.js --name elite-api
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Serve static files
       root /path/to/client/dist;
       index index.html;

       # API proxy
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Uploads proxy
       location /uploads {
           proxy_pass http://localhost:5000;
       }

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

5. **Enable HTTPS** with Let's Encrypt/Certbot

### Docker (Optional)

Create a `Dockerfile` in the server directory and use `docker-compose` to orchestrate the frontend, backend, and database.

### Security Checklist for Production

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Configure database firewall
- [ ] Set proper file permissions on uploads
- [ ] Disable directory listing
- [ ] Set up database backup cron jobs
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

---

## 💾 Backup & Security

### Database Backup

```bash
# Manual backup
mongodump --db elite_construction --out ./backup_$(date +%Y%m%d)

# Automated (cron job)
0 2 * * * mongodump --db elite_construction --out /backups/db_$(date +\%Y\%m\%d)
```

### File Backup

```bash
# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz server/uploads/
```

### Restore

```bash
mongorestore --db elite_construction ./backup_20240101/elite_construction
```

### Security Measures

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- HTTP security headers via Helmet
- Rate limiting on API routes
- CORS restricted to known origins
- Input validation with Zod on all endpoints
- NoSQL injection protection via Mongoose schema validation
- File upload validation (type, size, extension)
- Role-based access control on every protected endpoint
- Audit logging for sensitive operations
- Environment variables for all secrets
- No sensitive data in client-side code

---

## ❓ Troubleshooting

### Database Connection Issues

```bash
# Check MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

### Common Errors

| Error | Solution |
|---|---|
| `ECONNREFUSED` (database) | Ensure MongoDB is running on the configured host/port |
| Duplicate key error (code 11000) | Duplicate record - the value already exists |
| `401 Unauthorized` | Token expired or invalid - login again |
| `403 Forbidden` | User lacks required role/permission |
| `413 Payload Too Large` | Increase `max_file_size` setting |
| Module not found | Run `npm install` in the appropriate directory |

### Development Tips

- Check the server logs for detailed error messages
- Use `NODE_ENV=development` for more verbose logging
- The Vite dev server proxies `/api` requests to the backend
- The admin panel is at `/admin`, customer portal at `/customer`

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🤝 Support

For support, contact:
- Email: info@eliteconstruction.com
- Phone: +250 788 000 000
- WhatsApp: +250 788 000 000

---

*Built with excellence. Delivering trust.*
