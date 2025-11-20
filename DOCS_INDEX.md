# 📚 CNCT Documentation Index

Welcome to the CNCT documentation! This index provides quick access to all project documentation files.

## 🚀 Getting Started

**Start here if you're new to the project:**

- **[README.md](./README.md)** - Project overview, setup instructions, tech stack, and quick start guide

## 🗄️ Database & Backend

**Supabase database schema, functions, and security policies:**

- **[Supabase/SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD)** - Complete database schema with tables, columns, and relationships
- **[Supabase/SUPABASE_FUNCTIONS.MD](./Supabase/SUPABASE_FUNCTIONS.MD)** - Database functions and triggers
- **[Supabase/RLS_POLICIES](./Supabase/RLS_POLICIES)** - Row Level Security policies for data access control

## 📦 Storage & Files

**Image upload configuration and bucket management:**

- **[SUPABASE_BUCKETS.md](./SUPABASE_BUCKETS.md)** - Storage bucket configuration, RLS policies, file naming conventions, and upload flows

## 🏗️ Project Structure

```
cnct/
├── README.md                    # Main project documentation
├── SUPABASE_BUCKETS.md         # Storage configuration guide
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

## 📖 Documentation by Topic

### Authentication & Security
- [README.md - Backend Setup](./README.md#backend-backend-devs-only) - Service role key configuration
- [Supabase/RLS_POLICIES](./Supabase/RLS_POLICIES) - Row Level Security policies
- [SUPABASE_BUCKETS.md - RLS Policies](./SUPABASE_BUCKETS.md#row-level-security-rls-policies) - Storage access control

### Data Models
- [Supabase/SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD) - All tables and relationships
- [Supabase/SUPABASE_FUNCTIONS.MD](./Supabase/SUPABASE_FUNCTIONS.MD) - Database functions

### File Uploads
- [SUPABASE_BUCKETS.md](./SUPABASE_BUCKETS.md) - Complete storage guide
- [README.md - Uploading Images](./README.md#uploading-images) - Quick upload examples

### Development Setup
- [README.md - Frontend Setup](./README.md#frontend) - React + Vite setup
- [README.md - Backend Setup](./README.md#backend-backend-devs-only) - Express backend setup
- [README.md - Running the Project](./README.md#running-the-project) - Start commands

## 🔗 Quick Links

| Topic | Documentation |
|-------|---------------|
| **Getting Started** | [README.md](./README.md) |
| **Database Schema** | [SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD) |
| **Storage Setup** | [SUPABASE_BUCKETS.md](./SUPABASE_BUCKETS.md) |
| **Security Policies** | [RLS_POLICIES](./Supabase/RLS_POLICIES) |
| **Database Functions** | [SUPABASE_FUNCTIONS.MD](./Supabase/SUPABASE_FUNCTIONS.MD) |

## 🆘 Need Help?

1. **Setup Issues**: Check [README.md - Setup sections](./README.md#setup)
2. **Database Questions**: See [Supabase/SUPABASE_SCHEMA.MD](./Supabase/SUPABASE_SCHEMA.MD)
3. **Upload Problems**: Review [SUPABASE_BUCKETS.md - Troubleshooting](./SUPABASE_BUCKETS.md#troubleshooting)
4. **Can't Find Something**: Use GitHub's search (press `/`) to search across all docs

## 📝 Contributing to Documentation

When creating or updating documentation:

1. **Update this index** if you add new `.md` files
2. **Use clear headings** and section anchors for deep linking
3. **Include code examples** where applicable
4. **Keep it current** - update docs when changing features
5. **Link between docs** to create a knowledge graph

---

**Last Updated**: November 18, 2025
