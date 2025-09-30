# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- PostgreSQL running locally
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd backend
npm install
cd frontend && npm install && cd ..
```

### 2. Database Setup
```bash
# Create database
createdb backend_assignment

# Copy environment file
cp env.example .env

# Run migrations and seed data
npm run migrate
```

### 3. Start Development Servers
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs

### 5. Demo Accounts
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## 🐳 Docker Quick Start

```bash
# Start everything with Docker
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Access the application
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
```

## 📚 What's Included

### Backend Features
- ✅ JWT Authentication with role-based access
- ✅ Complete CRUD API for tasks
- ✅ User management (admin panel)
- ✅ Input validation and security middleware
- ✅ Swagger API documentation
- ✅ PostgreSQL database with proper schema

### Frontend Features  
- ✅ Modern React UI with Tailwind CSS
- ✅ Authentication flow (login/register)
- ✅ Task management dashboard
- ✅ Admin panel for user management
- ✅ Responsive design
- ✅ Real-time notifications

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input sanitization and validation
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Security headers

## 🎯 Assignment Requirements Met

- ✅ **User registration & login APIs** with password hashing and JWT
- ✅ **Role-based access** (user vs admin)
- ✅ **CRUD APIs** for tasks entity
- ✅ **API versioning**, error handling, validation
- ✅ **API documentation** (Swagger)
- ✅ **Database schema** (PostgreSQL)
- ✅ **Basic frontend UI** (React.js)
- ✅ **Secure JWT token handling**
- ✅ **Input sanitization & validation**
- ✅ **Scalable project structure**

## 🔧 Development Commands

```bash
# Backend
npm run dev          # Start development server
npm run migrate      # Run database migrations
npm test            # Run tests
npm start           # Start production server

# Frontend
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 📖 Next Steps

1. **Explore the API**: Visit http://localhost:3000/api-docs
2. **Test the Frontend**: Register a new account or use demo accounts
3. **Check Admin Features**: Login as admin@example.com
4. **Review the Code**: Explore the well-structured codebase
5. **Deploy**: Use Docker Compose for easy deployment

## 🆘 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review API documentation at `/api-docs`
- Check console logs for any errors
- Ensure PostgreSQL is running and accessible

---

**Ready to impress! 🎉** This project demonstrates enterprise-level backend development skills with modern best practices.

