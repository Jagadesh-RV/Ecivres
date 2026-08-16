# EcivreS Documentation

Welcome to the comprehensive technical documentation for **EcivreS**, a local services marketplace application.

## Overview
EcivreS is a dual-platform application (React Native Mobile + NestJS Backend) designed to connect customers with local service providers. It features real-time bookings, provider service listings, customer profiles, role-based access control, and payment processing.

## Development Status
- **Current Phase:** Phase 3 (RBAC + Profile Management Deployment).
- **Core Infrastructure:** Successfully implemented (NestJS API, Prisma, PostgreSQL, Docker, React Native Mobile, Metro, Android Gradle).
- **Authentication:** Fully functional with JWT access and refresh token flows.
- **Authorization:** Functional with `RolesGuard` and basic `UserRole` seeding.
- **Next Up:** Services/Bookings APIs, Frontend UI polishing.

## Technology Stack
- **Frontend:** React Native (0.87), React Navigation, Zustand, Axios, AsyncStorage
- **Backend:** NestJS (11.0), Prisma ORM (7.9.1), Passport, JWT
- **Database:** PostgreSQL (15), managed via Docker Compose
- **DevOps:** Docker, pnpm (monorepo workspaces), Gradle (Android)

## Documentation Map
This repository contains a full suite of technical documentation:

*   [System Architectures](file:///D:/Ecivres/docs/architecture/SYSTEM-ARCHITECTURE.md)
*   [Database Schema & Models](file:///D:/Ecivres/docs/database/DATABASE-SCHEMA.md)
*   [Authentication & JWT Guide](file:///D:/Ecivres/docs/authentication/AUTHENTICATION-OVERVIEW.md)
*   [Mobile State & Navigation](file:///D:/Ecivres/docs/mobile/STATE-AND-NAVIGATION.md)
*   [Backend API Reference](file:///D:/Ecivres/docs/backend/API-REFERENCE.md)
*   [Security Architecture](file:///D:/Ecivres/docs/security/SECURITY-ARCHITECTURE.md)
*   [Current Project Status](file:///D:/Ecivres/docs/project-status/CURRENT-STATUS.md)

## Getting Started
Please refer to the [COMMANDS.md](file:///D:/Ecivres/COMMANDS.md) file in the root directory for a cheat sheet of all `pnpm` and `docker` commands required to run the development environment.
