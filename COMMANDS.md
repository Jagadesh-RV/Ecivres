# EcivreS Application Commands

This document contains all the necessary commands to run, build, and maintain the EcivreS monorepo application. 

All commands should be executed from the **root directory** (`D:\Ecivres`) unless otherwise specified.

## 🐳 Infrastructure & Setup

Start the background services (PostgreSQL, Redis, etc.) using Docker.
```bash
docker compose up -d
```

Install all dependencies across the monorepo.
```bash
pnpm install
```

## 🛠️ Backend API (NestJS + Prisma)

**1. Database Schema & Client**
Push the latest schema to the database and generate the Prisma Client.
```bash
pnpm --filter api exec prisma db push
pnpm --filter api exec prisma generate
```

**2. Seed the Database**
Populate the database with initial required data (like Roles, Permissions, etc.).
```bash
pnpm --filter api run seed
```

**3. Database GUI (Prisma Studio)**
Open the Prisma Studio UI in your browser to view and edit database records.
```bash
pnpm --filter api exec prisma studio
```

**4. Start the API Server**
Run the backend in watch mode for development.
```bash
pnpm --filter api start:dev
```

## 📱 Mobile Application (React Native)

**1. Start the Metro Bundler**
Start the JavaScript bundler for React Native.
```bash
pnpm --filter mobile start
```
*If you run into weird caching issues, clear the cache using:*
```bash
pnpm --filter mobile start --reset-cache
```

**2. Run on Android Device / Emulator**
Compile the app and install it on your connected Android device or running emulator.
```bash
pnpm --filter mobile android
```

**3. Clean Android Build (Troubleshooting)**
If your Android build fails with C++ or Gradle target errors, clean the build caches:
```bash
# Delete the native C++ build cache
rm -rf apps/mobile/android/app/.cxx

# Run the Gradle clean task
cd apps/mobile/android
./gradlew clean
cd ../../..
```
