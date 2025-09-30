# 🚀 Backend Developer Intern Assignment

A scalable REST API with Authentication & Role-Based Access Control, built with Node.js, Express, PostgreSQL, and React.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Frontend](#frontend)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [Scalability Notes](#scalability-notes)
- [Testing](#testing)
- [Contributing](#contributing)

## ✨ Features

### Backend Features
- ✅ **User Authentication**: JWT-based authentication with password hashing
- ✅ **Role-Based Access Control**: User and Admin roles with different permissions
- ✅ **CRUD Operations**: Complete task management system
- ✅ **API Versioning**: RESTful API with proper versioning (`/api/v1/`)
- ✅ **Input Validation**: Comprehensive request validation and sanitization
- ✅ **Error Handling**: Centralized error handling with proper HTTP status codes
- ✅ **API Documentation**: Interactive Swagger documentation
- ✅ **Database Schema**: Well-designed PostgreSQL schema with relationships
- ✅ **Security Middleware**: Helmet, CORS, rate limiting, XSS protection
- ✅ **Logging**: Request logging with Morgan

### Frontend Features
- ✅ **Modern React UI**: Built with React 18, Vite, and Tailwind CSS
- ✅ **Authentication Flow**: Login, registration, and protected routes
- ✅ **Task Management**: Create, read, update, delete tasks
- ✅ **Dashboard**: Overview with statistics and recent tasks
- ✅ **Admin Panel**: User management and system monitoring
- ✅ **Responsive Design**: Mobile-first responsive design
- ✅ **Real-time Feedback**: Toast notifications and loading states

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, express-rate-limit
- **Process Manager**: PM2 (production)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (frontend)
- **Database**: PostgreSQL
- **Caching**: Redis (optional)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── swagger.js          # Swagger configuration
│   ├── database/
│   │   ├── connection.js        # Database connection
│   │   ├── migrate.js          # Database migration
│   │   └── seed.js             # Database seeding
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validation.js       # Request validation middleware
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── users.js            # User management routes
│   │   └── tasks.js            # Task CRUD routes
│   ├── validators/
│   │   └── validationSchemas.js # Validation schemas
│   └── server.js               # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── main.jsx            # App entry point
│   ├── public/                  # Static assets
│   └── package.json
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile                  # Backend Dockerfile
└── README.md
```

## 🔧 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- Docker & Docker Compose (optional)

## 🚀 Installation

### Option 1: Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Update the `.env` file with your database credentials and JWT secret.

5. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb backend_assignment
   
   # Run migrations and seed data
   npm run migrate
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

7. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: Docker Setup

1. **Clone and start with Docker Compose**
   ```bash
   git clone <repository-url>
   cd backend
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

#### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update current user profile
- `GET /api/v1/users` - Get all users (Admin only)
- `PUT /api/v1/users/:id` - Update user by ID (Admin only)

#### Tasks
- `GET /api/v1/tasks` - Get user's tasks
- `GET /api/v1/tasks/:id` - Get specific task
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/admin/all` - Get all tasks (Admin only)

### Demo Accounts

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## 🎨 Frontend

The React frontend provides a complete user interface for:

- **Authentication**: Login and registration forms
- **Dashboard**: Overview with task statistics
- **Task Management**: Full CRUD operations with filtering
- **Profile Management**: Update user information
- **Admin Panel**: User and task management (admin only)

### Frontend URLs
- **Application**: http://localhost:3001
- **Login**: http://localhost:3001/login
- **Register**: http://localhost:3001/register

## 🚀 Deployment

### Production Deployment with Docker

1. **Build and start services**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

2. **Set production environment variables**
   ```bash
   # Update docker-compose.yml with production values
   # - Change JWT_SECRET
   # - Update database credentials
   # - Set CORS_ORIGIN to your domain
   ```

3. **Run migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

### Manual Deployment

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start backend with PM2**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "backend-api"
   ```

3. **Serve frontend with Nginx**
   ```bash
   # Configure Nginx to serve frontend/build
   # Proxy /api requests to backend
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: Request rate limiting per IP
- **Security Headers**: Helmet.js security headers
- **Role-Based Access**: Granular permission system

## 📈 Scalability Notes

### Current Architecture
- **Monolithic Backend**: Single Express.js application
- **PostgreSQL Database**: Relational database with proper indexing
- **Stateless Authentication**: JWT tokens for horizontal scaling
- **RESTful APIs**: Standard HTTP methods and status codes

### Scalability Improvements

1. **Microservices Architecture**
   - Split into user-service, task-service, auth-service
   - API Gateway for routing and authentication
   - Service mesh for communication

2. **Database Optimization**
   - Read replicas for read-heavy operations
   - Database sharding by user ID
   - Connection pooling and query optimization

3. **Caching Strategy**
   - Redis for session storage and caching
   - CDN for static assets
   - Application-level caching

4. **Load Balancing**
   - Multiple backend instances behind load balancer
   - Database connection pooling
   - Horizontal pod autoscaling

5. **Monitoring & Logging**
   - Application performance monitoring (APM)
   - Centralized logging with ELK stack
   - Health checks and metrics collection

## 🧪 Testing

### Backend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=backend_assignment
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Backend Developer Intern**
- Email: intern@example.com
- GitHub: [@intern](https://github.com/intern)

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- React team for the powerful UI library
- PostgreSQL team for the robust database
- All open-source contributors who made this possible

---

**Note**: This is a demonstration project for a backend developer intern assignment. In production, please ensure proper security measures, environment variable management, and database backups.

