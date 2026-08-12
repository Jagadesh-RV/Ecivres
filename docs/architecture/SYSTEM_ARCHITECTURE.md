# System Architecture

EcivreS uses a Modular Monolith architecture.
This means the backend is a single deployed Node.js (NestJS) application, but internally it is strictly divided into logical modules.

## Why a Modular Monolith?
- **Team Size**: Developed by one developer. Microservices would introduce unnecessary DevOps overhead.
- **Simplicity**: Easier to trace requests, handle transactions, and deploy.
- **Maintainability**: Modules are decoupled. If the project scales, modules can later be extracted into microservices.

## High-Level Flow
Mobile App (Expo) -> REST API (NestJS) -> PostgreSQL
