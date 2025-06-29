# ISMS (Integrated School Management System) API

A comprehensive RESTful API server for school management built with TypeScript, NestJS, and MongoDB. This system provides complete management capabilities for educational institutions including student enrollment, academic tracking, attendance management, and administrative functions.

## 🚀 Features

- **Multi-Role Authentication**: JWT-based authentication for Students, Teachers, Guardians, and Administrators
- **Academic Management**: Complete subject, classroom, and curriculum management
- **Attendance Tracking**: Real-time attendance marking and monitoring
- **Grade Management**: Grade recording, result compilation, and academic progress tracking
- **User Management**: Comprehensive user profiles for all stakeholders
- **Role-Based Access Control (RBAC)**: Granular permissions based on user roles
- **File Upload**: Cloudinary integration for profile images and documents
- **Data Export**: CSV import/export capabilities for bulk operations
- **Real-time Caching**: Redis-powered caching for improved performance

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Core Modules](#core-modules)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🛠 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- Package manager: npm, yarn, or pnpm (pnpm preferred)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd isms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment configuration**
   Create a `.env` file in the root directory (see [Environment Configuration](#environment-configuration))

4. **Start the development server**
   ```bash
   pnpm run start:dev
   ```

5. **Access the API**
   - Server will be running on `http://localhost:3000`
   - Health check: `GET /healthz`

## ⚙️ Environment Configuration

Create a `.env` file with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/isms

# Redis Cache
REDIS_CACHE=redis://localhost:6379

# JWT Secrets
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Security
COOKIE_SECRET=your_cookie_secret
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication with the following token types:

- **Access Token**: Short-lived (2 hours) for API requests
- **Refresh Token**: Long-lived (30 days) stored in HTTP-only cookies

### Authentication Flow

1. **Register/Login**: Obtain access and refresh tokens
2. **API Requests**: Include access token in Authorization header
3. **Token Refresh**: Use refresh endpoint when access token expires

```bash
# Login request
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "role": "student",
    "admission_no": "STD001",
    "password": "password"
  }'

# Authenticated request
curl -H "Authorization: Bearer <access_token>" \
  http://localhost:3000/api/v1/students
```

## 👥 User Roles

### Student
- View personal academic information
- Check attendance records
- View grades and results
- Access assigned classroom information

### Teacher
- Manage assigned subjects
- Mark student attendance
- Record and update grades
- View classroom rosters
- Access student academic records

### Guardian
- View ward's academic progress
- Access attendance reports
- Monitor grade reports
- Communicate with teachers

### Admin
- Complete system access
- User management (create, update, delete)
- Academic structure management
- System configuration
- Generate reports

## 🏗 Core Modules

### 1. Authentication Module (`/auth`)
Handles user registration, login, logout, and token management.

### 2. Users Module (`/users`)
Manages user profiles and relationships between students, teachers, and guardians.

### 3. Academics Module (`/academics`)
Core academic functionality including subjects, classrooms, grades, attendance, and results.

### 4. Cloudinary Module
File upload and media management integration.

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | User logout | Authenticated |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/users/:role` | Get users by role | Admin |
| GET | `/students` | Get student info | Student |
| POST | `/students/:id/guardians` | Add guardian to student | Teacher/Admin |
| POST | `/students/assign-classroom` | Assign student to classroom | Student |

### Academic Management

#### Subjects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/subjects` | Create new subject | Admin |
| GET | `/subjects/:id` | Get subject details | All roles |
| POST | `/subjects/allocate/:id` | Allocate teacher to subject | Admin |
| DELETE | `/subjects/:id` | Delete subject | Admin |

#### Classrooms
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/classroom` | Create classroom | Admin |
| POST | `/classroom/teacher/:classroomID/:teacherID` | Assign teacher to classroom | Admin |
| POST | `/classroom/student/:classroomID/:studentID` | Assign student to classroom | Teacher/Admin |
| POST | `/classroom/transfer` | Transfer student between classrooms | Teacher/Admin |
| GET | `/classroom/:id/students` | Get all students in classroom | Teacher/Admin |

#### Attendance
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/attendance` | Mark attendance | Teacher/Admin |
| GET | `/attendance/student/:id` | Get student attendance | Teacher/Admin/Guardian |
| GET | `/attendance/subject/:id` | Get subject attendance | Teacher/Admin |

#### Grades & Results
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/grades` | Record individual grade | Teacher/Admin |
| POST | `/grades/bulk` | Bulk upload grades via CSV | Teacher/Admin |
| PUT | `/grades/:id` | Update grade | Teacher/Admin |
| GET | `/grades/student/:id` | Get student grades | Teacher/Admin/Guardian |
| POST | `/results/generate` | Generate student results | Teacher/Admin |
| GET | `/results/student/:id` | Get compiled results | All roles |

### Health Check
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/healthz` | Server health status | Public |

## 🗄 Database Schema

### User Schema (Base)
```typescript
{
  role: string, // student, teacher, guardian, admin
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  gender: string, // M, F
  profile_image?: {
    secure_url: string,
    public_id: string
  },
  last_login: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Schema (extends User)
```typescript
{
  admission_no: string, // Auto-generated unique ID
  current_class?: ObjectId, // Reference to Classroom
  guardians: ObjectId[], // Array of Guardian references
  date_of_birth: Date,
  medical_info?: {
    blood_group: string,
    allergies: string[]
  },
  enrollment_status: string // enrolled, suspended, expelled
}
```

### Teacher Schema (extends User)
```typescript
{
  staff_id: string, // Auto-generated unique ID
  subjects: ObjectId[], // Array of Subject references
  qualifications: string[],
  employed_at: Date,
  is_active: boolean,
  is_hod: boolean, // Head of Department
  bio?: string
}
```

### Guardian Schema (extends User)
```typescript
{
  wards: ObjectId[], // Array of Student references
  occupation: string,
  marital_status: string,
  home_address: string
}
```

### Classroom Schema
```typescript
{
  name: string,
  academic_session: string, // Format: YYYY/YYYY
  class_teacher: ObjectId, // Teacher reference
  no_of_students: number,
  is_active: boolean,
  deleted_at?: Date
}
```

### Subject Schema
```typescript
{
  name: string,
  code: string, // Unique per academic session
  description?: string,
  teachers: ObjectId[], // Array of Teacher references
  grade_level: string,
  academic_session: string,
  is_active: boolean,
  deleted_at?: Date
}
```

### Attendance Schema
```typescript
{
  student: ObjectId, // Student reference
  subject: ObjectId, // Subject reference
  date: Date,
  status: string, // present, absent, late, excused
  academic_session: string
}
```

### Grade Schema
```typescript
{
  student: ObjectId,
  subject: ObjectId,
  classroom: ObjectId,
  academic_session: string,
  term: string, // first, second, third
  scores: {
    assessment: number,
    exam: number,
    total: number
  },
  grade: string, // A, B, C, D, F
  remarks?: string,
  recorded_by: ObjectId // Teacher reference
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm run start:dev      # Start with hot reload
pnpm run start:debug    # Start in debug mode

# Building
pnpm run build          # Build for production
pnpm run start:prod     # Start production server

# Code Quality
pnpm run lint           # Run ESLint
pnpm run format         # Format code with Prettier

# Testing
pnpm run test           # Run unit tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:cov       # Run tests with coverage
pnpm run test:e2e       # Run end-to-end tests
```

### Project Structure

```
src/
├── academics/          # Academic management module
│   ├── controllers/    # REST controllers
│   ├── services/       # Business logic
│   ├── schemas/        # Database models
│   └── dtos/          # Data transfer objects
├── auth/              # Authentication module
├── users/             # User management module
├── cloudinary/        # File upload service
├── guards/            # Auth guards and middleware
├── decorators/        # Custom decorators
├── pipes/             # Validation pipes
├── filters/           # Exception filters
├── lib/               # Utilities and constants
└── types/             # TypeScript type definitions
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for NestJS best practices
- **Prettier**: Code formatting
- **Class Validator**: DTO validation
- **Mongoose**: MongoDB ODM with discriminators

## 🧪 Testing

### Unit Tests
```bash
pnpm run test
```

### Integration Tests
```bash
pnpm run test:e2e
```

### Test Coverage
```bash
pnpm run test:cov
```

## 🚀 Deployment

### Production Build
```bash
pnpm run build
pnpm run start:prod
```

### Environment Variables (Production)
Ensure all environment variables are properly configured for production:

- Set `NODE_ENV=production`
- Use secure secrets for JWT tokens
- Configure production database URLs
- Set up SSL certificates
- Configure CORS for production domains

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

## 📈 Performance & Monitoring

- **Caching**: Redis integration for improved response times
- **Rate Limiting**: Built-in throttling protection
- **Compression**: gzip compression enabled
- **Security**: Helmet.js for security headers
- **Health Checks**: Built-in health monitoring

## 🛠 Current Development Status

### ✅ Implemented Features
- Multi-role JWT authentication system
- Complete CRUD operations for subjects
- Attendance marking and tracking
- Classroom management and assignments
- Grade recording and result generation
- Role-based access control (RBAC)
- File upload integration with Cloudinary
- CSV bulk upload capabilities
- Real-time caching with Redis

### 🚧 Work in Progress
- Advanced reporting system
- Email notification service
- Mobile app API optimization
- Advanced search and filtering

### 📋 TODO
- Implement Parse CSV function in `lib/utils`
- Add CSRF protection for cookie-based refresh tokens
- Implement audit logging
- Add comprehensive API documentation with Swagger
- Performance optimization for large datasets

### 🐛 Known Issues
- Bulk upload result returns never type for error key
- Need mongo sanitization improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the UNLICENSED License - see the package.json file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Review existing documentation
- Check the API endpoint documentation

---

**Built with ❤️ using NestJS, TypeScript, and MongoDB**