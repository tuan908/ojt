Here's your improved and detailed **README.md** with added information about the project structure, frontend, backend, and missing installation steps.

---

# 社会人基礎力

*Empowering Students Through Seamless Event Management*

![Last Commit](https://img.shields.io/github/last-commit/tuan908/ojt)
![TypeScript](https://img.shields.io/badge/typescript-68.0%25-blue)
![Languages](https://img.shields.io/badge/languages-5-gray)

## Built with the tools and technologies:

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Hono-orange?logo=hono&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring-green?logo=Spring&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />
</p>

---

# Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)

---

# Overview

### Why OJT?

This project provides a full-stack event management system, integrating **Next.js** and **Hono.js** for the frontend and API gateway, while using **Spring Boot** for a robust backend.

Key Features:

- 🚀 **Spring Boot Backend**: A well-structured, scalable API with PostgreSQL database integration.
- 🏗 **Next.js + Hono.js Frontend**: A high-performance, modern frontend for seamless user interaction.
- 🐳 **Docker Support**: Enables easy deployment with consistent configurations.
- ⚠️ **Custom Exception Handling**: Enhances API reliability with structured error responses.
- 📦 **Data Transfer Objects (DTOs)**: Separates API logic from domain models for better maintainability.
- ⚡ **Caching with Redis**: Improves performance by minimizing database queries.
- 🔒 **Role-Based Access Control (RBAC)**: Ensures secure access to resources.

---

# Project Structure

```
ojt/
│── backend/                   # Spring Boot Backend
│   ├── src/main/java/com/tuanna/api   # Main Java code
│   ├── src/main/resources/            # Configuration files (application.yml)
│   ├── Dockerfile
│   ├── build.gradle.kts
│   ├── gradlew
│   └── settings.gradle.kts
│
│── frontend/                          # Next.js + Hono.js Frontend
│   ├── src/
│   │   ├── app/                       # Layout
|   |     ├── actions/                 # Server Actions
│   │   ├── features/                  # Features
│   │   ├── shared/                    # Custom hooks
│   │   ├── server/                    # API functions using Hono
│   ├── public/                        # Static assets
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── .env.local.example             # Environment variable example
│   └── README.md
│
│── docker-compose.yml                 # Docker Compose for running services
│── .gitignore
│── README.md
```

---

# Getting Started

## Prerequisites

Ensure you have the following installed:

- **Programming Languages**: TypeScript, Java
- **Package Managers**: Gradle (for backend), PNPM (for frontend)
- **Container Runtime**: Docker & Docker Compose
- **Database**: PostgreSQL
- **Cache System**: Redis

## Installation

Follow these steps to set up the project locally.

### 1. Clone the repository:

```bash
git clone https://github.com/tuan908/ojt
cd ojt
```

### 2. Set up the backend (Spring Boot)

```bash
cd backend
./gradlew build  # Build the backend
```

Configure environment variables in `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ojt_db
    username: your_db_user
    password: your_db_password
  redis:
    host: localhost
    port: 6379
```

Run the backend:

```bash
./gradlew bootRun
```

### 3. Set up the frontend (Next.js + Hono)

```bash
cd frontend
pnpm install   # Install dependencies
```

Create a `.env.local` file from `.env.local.example` and configure API URLs:

```ini
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run the frontend:

```bash
pnpm dev
```

### 4. Run with Docker (optional)

To run both backend and frontend using **Docker Compose**:

```bash
docker-compose up --build
```

---

## Usage

Once everything is running:

- Access the **frontend** at [http://localhost:3000](http://localhost:3000)
- API requests go through **Hono.js**, acting as the gateway to Spring Boot.
- Authentication and authorization are enforced using JWT.
- PostgreSQL and Redis must be running for database and caching operations.

---

## Testing

### Backend Tests (Spring Boot)

```bash
cd backend
./gradlew test
```

### Frontend Tests (Jest)

```bash
cd frontend
pnpm test
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request.

---

## License

This project is licensed under the **MIT License**.

---