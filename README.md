# NexSplit - Smart Expense Tracking & Splitting Platform

<div align="center">

![NexSplit Logo](https://img.shields.io/badge/NexSplit-Expense%20Tracker-blue?style=for-the-badge&logo=calculator)

**Split expenses effortlessly with friends and family**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.java.net/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=flat-square&logo=docker)](https://docker.com/)

</div>

## 🎥 Demo Video

Watch the complete application walkthrough:

[![NexSplit Demo](https://img.shields.io/badge/📺%20Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/4e2B8V4Jd7k)

## 📱 Application Screenshots

### Authentication & Onboarding

<div align="center">
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231545.png" alt="Sign In Page" width="300"/>
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231609.png" alt="Create Account Page" width="300"/>
</div>

### Dashboard & Main Interface

<div align="center">
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231651.png" alt="Dashboard" width="300"/>
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231743.png" alt="Expenses Overview" width="300"/>
</div>

### Expense Management & Group Management

<div align="center">
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231826.png" alt="Expense Details" width="300"/>
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231838.png" alt="Member Invitation" width="300"/>
</div>

### Settings & Profile Management

<div align="center">
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231853.png" alt="Profile Settings" width="300"/>
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 231904.png" alt="Account Management" width="300"/>
</div>

### Settlement Management & Debt Tracking

<div align="center">
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 234456.png" alt="Settlement Overview" width="300"/>
  <img src="frontend/public/screenshots/Screenshot 2025-09-21 234645.png" alt="Execute Settlements" width="300"/>
</div>

## 🚀 Features

### Core Functionality

- **📊 Smart Expense Tracking**: Track individual and shared expenses with detailed categorization
- **👥 Group Management (Nex)**: Create expense groups with multiple members and role-based access
- **💰 Debt Settlement**: Automated debt calculation and settlement tracking
- **📱 Real-time Updates**: Live updates across all devices using Server-Sent Events (SSE)
- **📎 File Attachments**: Upload receipts and documents with CDN integration
- **🔐 Secure Authentication**: JWT + OAuth2 (Google) authentication
- **📧 Email Notifications**: Automated email reminders and notifications

### Advanced Features

- **📈 Analytics & Reporting**: Comprehensive expense analytics and insights
- **🔄 Settlement Types**: Both simplified and detailed settlement options
- **⚡ Performance Monitoring**: Real-time performance tracking with Elasticsearch
- **🛡️ Security**: Rate limiting, CORS protection, and comprehensive logging
- **📱 Responsive Design**: Mobile-first design with PWA capabilities

## 🏗️ Architecture

### Backend (Spring Boot)

- **Framework**: Spring Boot 3.5.3 with Java 21
- **Database**: PostgreSQL 15 with Flyway migrations
- **Security**: Spring Security with JWT + OAuth2
- **Monitoring**: Elasticsearch 8.11.0 + Kibana 8.11.0
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Mapping**: MapStruct for DTO-entity mapping

### Frontend (Next.js)

- **Framework**: Next.js 15.5.3 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 🛠️ Technology Stack

| Component            | Technology              | Version |
| -------------------- | ----------------------- | ------- |
| **Backend**          | Spring Boot             | 3.5.3   |
| **Frontend**         | Next.js                 | 15.5.3  |
| **Language**         | Java                    | 21      |
| **Database**         | PostgreSQL              | 15      |
| **Search Engine**    | Elasticsearch           | 8.11.0  |
| **Visualization**    | Kibana                  | 8.11.0  |
| **Containerization** | Docker                  | Latest  |
| **Authentication**   | JWT + OAuth2            | -       |
| **Monitoring**       | Logback + Elasticsearch | -       |

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** (recommended)
- **Java 21** (for local development)
- **Node.js 18+** (for frontend development)
- **Maven 3.8+** (for backend development)

### Option 1: Full Stack with Monitoring (Recommended)

Start the complete application with monitoring:

```bash
# Windows PowerShell
.\backend\scripts\start-elasticsearch.ps1

# Linux/Mac
./backend/scripts/start-elasticsearch.sh

# Or manually
cd backend
docker-compose up -d --build
```

### Option 2: Application Only

Start just the application and database:

```bash
# Windows PowerShell
.\backend\scripts\start-dev.ps1

# Linux/Mac
./backend/scripts/start-dev.sh
```

### Option 3: Development Mode

#### Backend Development

```bash
cd backend

# Set up environment variables
cp env.development.template .env.development
# Edit .env.development with your configuration

# Run with Maven
./mvnw spring-boot:run
```

#### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Access URLs

Once started, you can access:

| Service                   | URL                                   | Description                 |
| ------------------------- | ------------------------------------- | --------------------------- |
| **NexSplit Application**  | http://localhost:3000                 | Main application (Frontend) |
| **Backend API**           | http://localhost:8080                 | REST API                    |
| **Swagger Documentation** | [http://95.111.248.142:8080/swagger-ui/index.html](http://95.111.248.142:8080/swagger-ui/index.html) | Live API Documentation     |
| **Kibana Dashboard**      | http://localhost:5601                 | Monitoring Dashboard        |
| **Elasticsearch**         | http://localhost:9200                 | Search Engine API           |

## 📋 Setup Guide

### 1. Environment Configuration

#### Backend Configuration

```bash
cd backend
cp env.development.template .env.development
```

Edit `.env.development` with your values:

```env
# Database
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=60

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Gmail)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

#### Frontend Configuration

```bash
cd frontend
# No additional configuration needed for development
```

### 2. Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized origins:
   - `http://localhost:3000` (Frontend)
   - `http://localhost:8080` (Backend)
6. Add redirect URI: `http://localhost:8080/login/oauth2/code/google`

### 3. Database Setup

The application uses Flyway for database migrations. Tables are automatically created on first startup.

### 4. Email Configuration (Optional)

For email notifications, configure Gmail SMTP:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your environment variables

## 🔧 Development

### Project Structure

```
NexSplit/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   ├── docker-compose.yml  # Docker services
│   └── scripts/            # Automation scripts
├── frontend/               # Next.js Frontend
│   ├── src/app/           # Next.js app directory
│   ├── src/components/     # React components
│   └── src/lib/           # Utilities and API
└── README.md              # This file
```

### Key Components

#### Backend Services

- **UserService**: User management and authentication
- **NexService**: Group (Nex) management
- **ExpenseService**: Expense tracking and management
- **SettlementService**: Debt calculation and settlement
- **EmailService**: Email notifications

#### Frontend Pages

- **Authentication**: Login, Register, Password Reset
- **Dashboard**: Overview and analytics
- **Expenses**: Expense management and tracking
- **Settings**: User profile and account management

### API Endpoints

| Endpoint              | Method   | Description              |
| --------------------- | -------- | ------------------------ |
| `/api/auth/**`        | POST     | Authentication endpoints |
| `/api/users/**`       | GET/PUT  | User management          |
| `/api/nex/**`         | CRUD     | Group (Nex) management   |
| `/api/expenses/**`    | CRUD     | Expense management       |
| `/api/settlements/**` | POST/GET | Settlement operations    |

## 📊 Monitoring & Logging

### Elasticsearch Integration

The application automatically sends structured logs to Elasticsearch:

- **Business Events**: `nexsplit-logs-business-*`
- **Security Events**: `nexsplit-logs-security-*`
- **Performance Events**: `nexsplit-logs-performance-*`
- **Error Events**: `nexsplit-logs-error-*`

### Kibana Dashboards

1. Open Kibana at http://localhost:5601
2. Create index patterns for each log type
3. Build dashboards for monitoring and analytics

## 📚 API Documentation

### Live Swagger Documentation

Access the complete API documentation with interactive testing:

**[🔗 Live Swagger UI](http://95.111.248.142:8080/swagger-ui/index.html)**

The Swagger documentation provides:
- **Complete API Reference**: All endpoints with request/response schemas
- **Interactive Testing**: Test API endpoints directly from the browser
- **Authentication**: JWT token integration for protected endpoints
- **Request Examples**: Sample requests and responses
- **Error Codes**: Comprehensive error handling documentation

### API Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/**` | POST | Authentication endpoints |
| `/api/users/**` | GET/PUT | User management |
| `/api/nex/**` | CRUD | Group (Nex) management |
| `/api/expenses/**` | CRUD | Expense management |
| `/api/settlements/**` | POST/GET | Settlement operations |

## 🚀 Deployment

### Production Deployment

```bash
# Build and deploy
cd backend
./scripts/deploy-production.sh v1.0.0

# Or with PowerShell
.\scripts\deploy-production.ps1 v1.0.0
```

### Docker Deployment

```bash
# Build and push Docker image
./scripts/build-and-push.sh v1.0.0
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **OAuth2 Integration**: Google OAuth2 for social login
- **Password Hashing**: BCrypt password hashing
- **CORS Protection**: Configured CORS policies
- **Rate Limiting**: API rate limiting and throttling
- **Security Logging**: Comprehensive security event tracking

## 📚 Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Deployment Guide](backend/doc/DEPLOYMENT_GUIDE.md)
- [Security Guidelines](backend/doc/SECURITY.md)
- [Logging Guidelines](backend/doc/LOGGING_GUIDELINES.md)
- [Kibana Dashboard Setup](backend/doc/KIBANA_DASHBOARDS.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](backend/LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting Guide](backend/README.md#troubleshooting)
2. Review the logs in `backend/logs/`
3. Check service health: `docker-compose ps`
4. View logs: `docker-compose logs -f`

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Recurring expense automation
- [ ] Integration with banking APIs
- [ ] Advanced reporting features

---

<div align="center">

**Built with ❤️ by the NexSplit Team**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github)](https://github.com/your-username/nexsplit)
[![Issues](https://img.shields.io/badge/Issues-Report%20Bug-red?style=flat-square&logo=github)](https://github.com/your-username/nexsplit/issues)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-green?style=flat-square&logo=github)](https://github.com/your-username/nexsplit/pulls)

</div>
