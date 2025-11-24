# 📚 CNCT Documentation Index

Welcome to the CNCT documentation! This index provides quick access to all project documentation files.

---

## 🚀 Getting Started

**Start here if you're new to the project:**

- **[README.md](./README.md)** - Project overview, setup instructions, tech stack, and quick start guide
- **[docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md)** - Quick integration guide for frontend-backend connection
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🗄️ Database & Backend

### Database Documentation
- **[Supabase/SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD)** - Complete database schema with tables, columns, and relationships
- **[Supabase/SUPABASE_FUNCTIONS.MD](./Supabase/SUPABASE_FUNCTIONS.MD)** - Database functions, triggers, and how to call them
- **[Supabase/RLS_POLICIES](./Supabase/RLS_POLICIES)** - Row Level Security policies for data access control

### Backend API
- **[docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - REST API endpoints, request/response formats, and examples
- **[docs/BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md)** - Backend architecture and design patterns
- **[docs/CNCT Backend Design Doc.pdf](./docs/CNCT%20Backend%20Design%20Doc.pdf)** - Original backend design document

---

## 📦 Storage & Files

**Image upload configuration and bucket management:**

- **[docs/SUPABASE_BUCKETS.md](./docs/SUPABASE_BUCKETS.md)** - Storage bucket configuration, RLS policies, file naming conventions, and upload flows

---

## 🏗️ Project Structure

```
cnct/
├── README.md                    # Main project documentation
├── DOCS_INDEX.md               # This file - documentation index
├── docs/                       # All documentation files
│   ├── API_DOCUMENTATION.md   # REST API reference
│   ├── BACKEND_ARCHITECTURE.md # Backend design patterns
│   ├── INTEGRATION_GUIDE.md   # Integration guide
│   ├── SUPABASE_BUCKETS.md    # Storage configuration
│   ├── TROUBLESHOOTING.md     # Common issues & fixes
│   └── CNCT Backend Design Doc.pdf # Design document
├── src/                        # Frontend React app
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Route pages
│   ├── services/              # API & storage services
│   └── lib/                   # Utilities & helpers
├── server/                     # Express backend
│   ├── routes/                # API endpoints
│   ├── config/                # Configuration files
│   └── middleware/            # Auth & other middleware
└── Supabase/                   # Database documentation
    ├── SUPABASE_SCHEMA.MD     # Database schema
    ├── SUPABASE_FUNCTIONS.MD  # Database functions
    └── RLS_POLICIES           # Security policies
```

---

## 📖 Documentation by Topic

### 🔐 Authentication & Security
- [README.md - Backend Setup](./README.md#backend-backend-devs-only) - Service role key configuration
- [Supabase/RLS_POLICIES](./Supabase/RLS_POLICIES) - Row Level Security policies
- [docs/SUPABASE_BUCKETS.md - RLS Policies](./docs/SUPABASE_BUCKETS.md#row-level-security-rls-policies) - Storage access control

### 📊 Data Models
- [Supabase/SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD) - All tables and relationships
- [Supabase/SUPABASE_FUNCTIONS.MD](./Supabase/SUPABASE_FUNCTIONS.MD) - Database functions

### 🔌 API Integration
- [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) - Complete API reference
- [docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md) - Frontend-backend integration
- [README.md - Using the API](./README.md#using-the-api) - Quick API examples

### 📸 File Uploads
- [docs/SUPABASE_BUCKETS.md](./docs/SUPABASE_BUCKETS.md) - Complete storage guide
- [README.md - Uploading Images](./README.md#uploading-images) - Quick upload examples

### 🛠️ Development Setup
- [README.md - Frontend Setup](./README.md#frontend) - React + Vite setup
- [README.md - Backend Setup](./README.md#backend-backend-devs-only) - Express backend setup
- [README.md - Running the Project](./README.md#running-the-project) - Start commands

### 🐛 Troubleshooting
- [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Common problems and solutions

---

## 🔗 Quick Reference Table

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](./README.md) | Project overview & setup | Everyone |
| [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) | API endpoints reference | Frontend & Backend |
| [docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md) | Quick integration guide | Frontend |
| [docs/BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md) | Backend design | Backend |
| [docs/SUPABASE_BUCKETS.md](./docs/SUPABASE_BUCKETS.md) | Storage configuration | Full-stack |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common issues | Everyone |
| [Supabase/SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD) | Database schema | Backend & Database |
| [Supabase/SUPABASE_FUNCTIONS.MD](./Supabase/SUPABASE_FUNCTIONS.MD) | Database functions | Backend & Frontend |
| [Supabase/RLS_POLICIES](./Supabase/RLS_POLICIES) | Security policies | Backend & Database |
| [docs/CNCT Backend Design Doc.pdf](./docs/CNCT%20Backend%20Design%20Doc.pdf) | Original design document | Backend |

---

## 🆘 Need Help?

1. **Setup Issues**: Check [README.md - Setup sections](./README.md#setup)
2. **API Questions**: See [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
3. **Database Questions**: See [Supabase/SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD)
4. **Upload Problems**: Review [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
5. **Integration Help**: Check [docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md)
6. **Can't Find Something**: Use GitHub's search (press `/`) to search across all docs

---

## 📝 Contributing to Documentation

When creating or updating documentation:

1. **Add new docs to the `docs/` folder** for better organization
2. **Update this index** if you add new documentation files
3. **Use clear headings** and section anchors for deep linking
4. **Include code examples** where applicable
5. **Keep it current** - update docs when changing features
6. **Link between docs** to create a knowledge graph

---

**Last Updated**: November 24, 2025
