# EcivreS Monorepo Workspace Architecture

## Overview
EcivreS is organized as a pnpm workspace monorepo divided into applications (`apps/`) and shared packages (`packages/`).

## Workspace Packages
- `apps/api`: NestJS backend microservice handling GraphQL/REST APIs, authentication, payments, AI, and business logic.
- `apps/web`: Next.js 16 App Router SSR frontend for customer marketplace and provider portal.
- `apps/mobile`: React Native / Expo mobile application for iOS & Android provider dispatch.
- `packages/sdk-ts`: Official TypeScript API SDK for enterprise integrations and public developer webhooks.
- `packages/config-eslint`: Shared ESLint configurations across monorepo packages.
- `packages/config-typescript`: Shared `tsconfig.base.json` compiler options.
