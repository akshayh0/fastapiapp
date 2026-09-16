# 🚀 TalentSpark

### AI-Powered Job Discovery, Recruitment & Career Assistance Platform

TalentSpark is a full-stack web application designed to simplify the recruitment and job-search process by combining job management, company management, user authentication, job applications, AI assistance, semantic job search, resume analysis, and intelligent job matching into a single platform.

The project uses **React + TypeScript** for the frontend and **FastAPI + PostgreSQL** for the backend, with **Groq, LangChain, FastEmbed, and Qdrant** powering the AI and Retrieval-Augmented Generation (RAG) features.

---

## 🌐 Live Demo

🔗 **Live Application:** https://carrier-ak.vercel.app/

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing
- Protected API endpoints
- Role-Based Access Control (RBAC)
- Current-user authentication
- Password change
- Forgot-password functionality
- Password reset functionality

### 👤 User Management

- User registration
- User authentication
- User approval system
- User role management
- Pending-user management
- Administrative user management

### 💼 Job Management

- Create job postings
- View available jobs
- View individual job details
- Update job postings
- Delete job postings
- Search job opportunities
- Apply for jobs
- Manage job applications

### 🏢 Company Management

- Create companies
- View companies
- View company details
- Update company information
- Delete companies
- Manage company-related job postings

### 📄 Job Applications

- Apply for jobs
- Prevent duplicate applications
- View applications
- Track application status
- Approve applications

### 🤖 AI Assistant

- AI-powered career assistant
- AI chatbot
- Career-related questions
- LLM-powered responses
- LangChain integration
- Groq integration

### 🔎 Semantic Job Search

TalentSpark supports semantic job searching using vector embeddings.

Instead of relying only on exact keywords, job descriptions can be converted into vector embeddings and searched using semantic similarity.

### 📄 Resume Analysis

TalentSpark includes an AI-powered resume analysis service that can process resume information and generate career-related insights.

### 🎯 Job Matching

Candidate skills and experience can be compared with job information using vector similarity to identify relevant opportunities.

### 🧠 RAG

The platform includes Retrieval-Augmented Generation using:

- LangChain
- FastEmbed
- Qdrant
- Groq

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │ TypeScript + Vite   │
                         └──────────┬──────────┘
                                    │
                              REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FastAPI Backend   │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │    Auth     │       │    Jobs     │       │   Company   │
       │    RBAC     │       │     API     │       │     API     │
       └─────────────┘       └──────┬──────┘       └─────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │   PostgreSQL    │
                           └─────────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │   AI / RAG      │
                           └────────┬────────┘
                                    │
                       ┌────────────┼────────────┐
                       │            │            │
                       ▼            ▼            ▼
                  LangChain       Groq        Qdrant
                       │                         │
                       └──────────┬──────────────┘
                                  ▼
                              AI Results
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
React Frontend
 │
 │ REST API
 ▼
FastAPI Backend
 │
 ├── Authentication
 │
 ├── Authorization
 │
 ├── Job Management
 │
 ├── Company Management
 │
 ├── Applications
 │
 └── AI / RAG
        │
        ├── LangChain
        ├── FastEmbed
        ├── Qdrant
        └── Groq
              │
              ▼
          AI Response
```

---

# 👥 User Roles

TalentSpark uses role-based access control.

```text
                    TalentSpark
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      Candidate        Admin       Super Admin
          │              │              │
          │              │              ├── Manage Users
          │              │              ├── Approve Users
          │              │              └── Administrative Operations
          │              │
          │              ├── Manage Jobs
          │              ├── Manage Companies
          │              └── Manage Applications
          │
          ├── Browse Jobs
          ├── Apply for Jobs
          ├── Track Applications
          ├── AI Assistant
          ├── Resume Analysis
          └── Job Search
```

---

# 🔐 Authentication Flow

```text
                    Login
                      │
                      ▼
              Validate Credentials
                      │
                      ▼
               Generate JWT
                      │
                      ▼
               Client Request
                      │
                      ▼
                Verify Token
                      │
                      ▼
               Current User
                      │
                      ▼
                Check Role
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
           Allow              Deny
```

---

# 🤖 AI Architecture

TalentSpark integrates AI capabilities into the recruitment workflow.

```text
                     User
                      │
                      ▼
                React Frontend
                      │
                      ▼
                 FastAPI API
                      │
          ┌───────────┼────────────┐
          │           │            │
          ▼           ▼            ▼
        Chat       Resume       Job Match
          │        Analysis          │
          └──────────┬───────────────┘
                     │
                     ▼
                 AI Services
                     │
            ┌────────┼────────┐
            │        │        │
            ▼        ▼        ▼
        LangChain   Groq   FastEmbed
                              │
                              ▼
                           Qdrant
                              │
                              ▼
                        Search Results
```

---

# 🧠 Retrieval-Augmented Generation

TalentSpark uses RAG to combine information retrieval with AI generation.

```text
User Question
      │
      ▼
 FastAPI API
      │
      ▼
 RAG Service
      │
      ▼
 Generate / Search Embeddings
      │
      ▼
 Qdrant Vector Database
      │
      ▼
 Relevant Information
      │
      ▼
    Groq LLM
      │
      ▼
 Generated Response
```

---

# 🔎 Semantic Job Search

Semantic search allows users to search jobs based on meaning rather than only exact keyword matches.

Example:

```text
User Query:

"Python backend developer with API development experience"
```

The query can be converted into an embedding and compared with stored job embeddings.

```text
User Query
    │
    ▼
FastEmbed
    │
    ▼
Vector Embedding
    │
    ▼
Qdrant
    │
    ▼
Similarity Search
    │
    ▼
Matching Jobs
```

---

# 📄 Resume Analysis

The resume analysis service allows resume content to be processed by the AI layer.

```text
Resume
  │
  ▼
FastAPI
  │
  ▼
Resume Service
  │
  ▼
AI / LLM
  │
  ▼
Resume Analysis
  │
  ▼
Response
```

---

# 🎯 Job Matching

Candidate information can be used to find relevant job opportunities.

```text
Candidate
    │
    ├── Skills
    │
    └── Experience
           │
           ▼
       Embedding
           │
           ▼
        Qdrant
           │
           ▼
    Similar Job Vectors
           │
           ▼
     Matching Jobs
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User Interface |
| TypeScript | Type-safe development |
| Vite | Frontend development and build tool |
| Axios | API communication |
| CSS | Styling |
| ESLint | Code quality |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| SQLAlchemy | ORM |
| Pydantic | Data validation |
| Alembic | Database migrations |
| PostgreSQL | Relational database |
| AsyncPG | Async PostgreSQL driver |
| Python-JOSE | JWT handling |
| Bcrypt | Password hashing |

## AI / RAG

| Technology | Purpose |
|---|---|
| Groq | LLM inference |
| LangChain | LLM application framework |
| FastEmbed | Text embeddings |
| Qdrant | Vector database |
| RAG | Retrieval-Augmented Generation |

## DevOps

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container development |
| Vercel | Frontend deployment |
| Git | Version control |
| GitHub | Source code hosting |

---

# 📁 Project Structure

```text
fastapiapp/
│
├── backend/
│   │
│   ├── app/
│   │   └── main.py
│   │
│   ├── models/
│   │   ├── company.py
│   │   ├── job.py
│   │   ├── job_application.py
│   │   └── users.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── company.py
│   │   ├── job.py
│   │   └── rag.py
│   │
│   ├── schemas/
│   │   ├── chat.py
│   │   ├── company.py
│   │   ├── job.py
│   │   ├── job_application.py
│   │   ├── rag.py
│   │   ├── token.py
│   │   └── users.py
│   │
│   ├── services/
│   │   ├── langchain_service.py
│   │   ├── qdrant_service.py
│   │   ├── rag_service.py
│   │   └── resume_service.py
│   │
│   ├── utils/
│   │   ├── oauth2.py
│   │   ├── security.py
│   │   └── token.py
│   │
│   ├── database.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic.ini
│
├── frontend/
│   │
│   └── talentspark/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── Services/
│       │   ├── types/
│       │   ├── assets/
│       │   ├── App.tsx
│       │   ├── App.css
│       │   └── main.tsx
│       │
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🔌 API Endpoints

## 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/forgot-password` | Forgot password |
| POST | `/auth/reset-password` | Reset password |
| POST | `/auth/reset-password-direct` | Direct password reset |
| GET | `/auth/users` | Get users |
| GET | `/auth/pending-users` | Get pending users |
| POST | `/auth/approve-user/{user_id}` | Approve user |
| DELETE | `/auth/users/{user_id}` | Delete user |

## 🏢 Company APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/company/` | Create company |
| GET | `/company/` | Get all companies |
| GET | `/company/{company_id}` | Get company |
| PUT | `/company/{company_id}` | Update company |
| DELETE | `/company/{company_id}` | Delete company |

## 💼 Job APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/job/` | Create job |
| GET | `/job/` | Get all jobs |
| GET | `/job/{job_id}` | Get a job |
| PUT | `/job/{job_id}` | Update job |
| DELETE | `/job/{job_id}` | Delete job |
| POST | `/job/{job_id}/apply` | Apply for a job |
| GET | `/job/applications` | Get applications |
| POST | `/job/applications/{application_id}/approve` | Approve application |

## 🤖 AI / RAG APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat/` | AI chatbot |
| POST | `/rag/embed-jobs` | Generate job embeddings |
| POST | `/rag/search` | Semantic job search |
| POST | `/rag/ask` | RAG-based question answering |
| POST | `/rag/analyse-resume` | Resume analysis |
| POST | `/rag/job-match` | Candidate-job matching |

---

# 📖 API Documentation

FastAPI automatically generates interactive API documentation.

After starting the backend, visit:

```text
http://localhost:8000/docs
```

Swagger UI allows you to:

- View API endpoints
- Test API requests
- Send request parameters
- Test authentication
- View API responses

Alternative documentation:

```text
http://localhost:8000/redoc
```

---

# 🚀 Installation & Setup

## Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js
- npm
- PostgreSQL
- Git
- Docker (optional)

You will also need credentials for the AI and vector database services used by the project.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/akshayh0/fastapiapp.git

cd fastapiapp
```

---

## 2️⃣ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment.

### Windows

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
```

Activate:

```bash
source venv/bin/activate
```

---

## 3️⃣ Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file and configure the required environment variables.

Example:

```env
DATABASE_URL=your_postgresql_database_url

SECRET_KEY=your_secret_key

ALGORITHM=HS256

GROQ_API_KEY=your_groq_api_key

QDRANT_URL=your_qdrant_url

QDRANT_API_KEY=your_qdrant_api_key
```

For the frontend:

```env
VITE_API_URL=http://localhost:8000
```

> ⚠️ Never commit `.env` files, API keys, database credentials, passwords, or secret keys to GitHub.

---

## 5️⃣ Start the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

---

## 6️⃣ Frontend Setup

Open a new terminal.

Navigate to the frontend:

```bash
cd frontend/talentspark
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

# 🐳 Docker Setup

The project includes Docker configuration.

From the project root:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

To run in the background:

```bash
docker compose up -d --build
```

---

# 🗄️ Database

TalentSpark uses PostgreSQL as its relational database.

SQLAlchemy is used as the ORM.

Main entities include:

```text
Users
   │
   ├───────────────┐
   │               │
   ▼               ▼
Companies      Applications
   │               ▲
   │               │
   ▼               │
 Jobs ─────────────┘
```

Main tables:

```text
users
companies
jobs
job_applications
```

---

# 🔄 Database Migrations

Alembic is used for database migrations.

Create a migration:

```bash
alembic revision --autogenerate -m "migration message"
```

Apply migrations:

```bash
alembic upgrade head
```

Rollback the latest migration:

```bash
alembic downgrade -1
```

---

# 🔒 Security

TalentSpark includes several security mechanisms:

- JWT authentication
- Password hashing
- OAuth2 authentication flow
- Role-Based Access Control
- Protected endpoints
- Pydantic validation
- Environment-based secrets

### Password Flow

```text
User Password
      │
      ▼
Password Hashing
      │
      ▼
Hashed Password
      │
      ▼
Database
```

Passwords should never be stored as plain text.

---

# 🧩 Backend Architecture

The backend follows a modular structure.

```text
Request
   │
   ▼
Router
   │
   ▼
Schema Validation
   │
   ▼
Authentication / Authorization
   │
   ▼
Service Layer
   │
   ├───────────────┐
   ▼               ▼
Database        AI Services
   │               │
   ▼               ▼
PostgreSQL     Groq / Qdrant
   │               │
   └───────┬───────┘
           ▼
        Response
```

---

# 🎨 Frontend Architecture

The React frontend is organized into reusable modules.

```text
React Application
       │
       ├── Components
       │
       ├── Pages
       │
       ├── Services
       │
       ├── Types
       │
       └── Assets
```

API communication is separated into service modules to keep the frontend organized and maintainable.

---

# 🧪 Development Commands

## Frontend

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

## Backend

Run development server:

```bash
uvicorn app.main:app --reload
```

Run on a custom host and port:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

# 🧠 AI Services

The backend contains dedicated services for AI functionality.

```text
services/
│
├── langchain_service.py
│       │
│       └── LLM interaction
│
├── qdrant_service.py
│       │
│       ├── Embeddings
│       ├── Vector storage
│       ├── Similarity search
│       └── Job matching
│
├── rag_service.py
│       │
│       └── Retrieval-Augmented Generation
│
└── resume_service.py
        │
        └── Resume analysis
```

---

# 📊 Job Embedding Pipeline

Jobs can be transformed into vector embeddings for semantic search.

```text
Job Data
   │
   ▼
Job Description
   │
   ▼
FastEmbed
   │
   ▼
Vector Embedding
   │
   ▼
Qdrant
   │
   ▼
Semantic Search
```

---

# 📈 Future Enhancements

Potential future improvements include:

- [ ] Advanced AI resume scoring
- [ ] Personalized job recommendations
- [ ] Resume-to-job compatibility analysis
- [ ] Candidate skill-gap analysis
- [ ] Automated email notifications
- [ ] Recruiter dashboard
- [ ] Candidate analytics
- [ ] Advanced job filtering
- [ ] Application status notifications
- [ ] Automated testing
- [ ] Frontend unit testing
- [ ] Backend unit testing
- [ ] Integration testing
- [ ] CI/CD pipeline
- [ ] API rate limiting
- [ ] Production monitoring
- [ ] Improved logging
- [ ] More granular permissions

---

# 🧪 Testing

Recommended testing areas include:

```text
Unit Tests
     │
     ├── Authentication
     ├── Job APIs
     ├── Company APIs
     ├── Application APIs
     └── AI Services

Integration Tests
     │
     ├── Database
     ├── Authentication
     └── API workflows

Frontend Tests
     │
     ├── Components
     ├── Pages
     └── API Services
```

---

# 🔐 Production Security Checklist

Before deploying the application publicly:

- [ ] Remove hard-coded credentials
- [ ] Remove API keys from source code
- [ ] Configure environment variables
- [ ] Use strong JWT secrets
- [ ] Configure production CORS
- [ ] Enable HTTPS
- [ ] Secure PostgreSQL credentials
- [ ] Add API rate limiting
- [ ] Protect admin endpoints
- [ ] Validate uploaded files
- [ ] Review error messages
- [ ] Enable production logging
- [ ] Add automated tests

---

# 📸 Screenshots

Add application screenshots to a `screenshots` folder and update this section.

Example:

```markdown
![Login Page](screenshots/login.png)

![Dashboard](screenshots/dashboard.png)

![Job Search](screenshots/jobs.png)

![AI Assistant](screenshots/ai-assistant.png)
```

---

# 🌐 Live Project

**Frontend:**

https://carrier-ak.vercel.app/

**Backend API:**

Configure your deployed backend URL here.

**API Documentation:**

```text
https://YOUR-BACKEND-URL/docs
```

---

# 📚 Technologies Demonstrated

This project demonstrates practical experience with:

- Full-stack web development
- REST API development
- FastAPI
- React
- TypeScript
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT authentication
- OAuth2
- Role-Based Access Control
- Docker
- REST APIs
- Large Language Models
- LangChain
- RAG
- Vector databases
- Semantic search
- Text embeddings
- AI-powered applications

---

# 🎓 Project Purpose

TalentSpark was developed as a practical full-stack AI application to explore how modern web technologies and generative AI can be combined to improve job discovery and recruitment workflows.

The project demonstrates the integration of:

```text
Frontend
   +
Backend
   +
Database
   +
Authentication
   +
AI
   +
Vector Search
   +
RAG
   =
Full-Stack AI Application
```

---

# 👨‍💻 Author

## Akshay H

**Artificial Intelligence & Machine Learning Student**

### Interests

- Artificial Intelligence
- Machine Learning
- Generative AI
- Full-Stack Development
- Backend Development
- Python
- FastAPI
- React
- RAG
- Vector Databases
- PostgreSQL

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is developed for educational and development purposes.

---

## 🚀 TalentSpark

**Connecting people, jobs, companies and AI in one platform.**
