# Ops-Forge

Ops-Forge is an internal technical workflow suite designed to manage tasks efficiently utilizing a modern, scalable monorepo architecture. 

## 🏗️ Architecture Stack

- **Monorepo Manager:** [Bun](https://bun.sh) workspaces
- **Backend API:** [NestJS](https://nestjs.com) (Node.js) + TypeScript
- **Database:** PostgreSQL + [Kysely](https://kysely.dev) (Type-safe query builder)
- **Migrations:** `graphile-migrate` + `pgcrypto` for hashing
- **Frontend SPA:** [React](https://react.dev) + [Vite](https://vitejs.dev)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) + Custom glassmorphism aesthetic
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Linting & Formatting:** [Biome](https://biomejs.dev)
- **Testing:** Native `bun test`
- **Deployment Strategy:** 
  - Backend: AWS Lambda via Serverless Framework (`@codegenie/serverless-express`)
  - Frontend: Cloudflare Pages via Wrangler

## 💡 General Description & Architecture Approach

Ops-Forge is built to be a robust, scalable, and highly maintainable full-stack application leveraging a modern toolchain. 

**Why this stack?**
- **Bun:** Chosen for its incredibly fast package management, native workspace support, and built-in test runner. It drastically speeds up the development lifecycle.
- **NestJS + Kysely:** NestJS provides a highly structured, scalable, and opinionated backend architecture. Combined with Kysely, we ensure strict type safety from the database layer up to the API responses, avoiding traditional ORM overhead while keeping raw SQL flexibility.
- **React + Vite + Zustand:** Vite offers an instant feedback loop during frontend development. React, paired with Zustand for minimalist and performant state management, ensures a snappy Single Page Application (SPA).
- **Serverless + Cloudflare Pages:** Deploying the NestJS API to AWS Lambda ensures a cost-effective, auto-scaling backend. Cloudflare Pages provides blazing-fast, globally distributed edge hosting for the frontend.

## 👤 End-User Perspective (How it works)

From an end-user standpoint, Ops-Forge is a clear, intuitive task management system:
1. **Authentication:** The user lands on a secure login screen. Upon entering valid credentials, they are authenticated via JWT and redirected to their dashboard.
2. **Task Management (CRUD):** 
   - **Create:** Users can add new tasks by filling out a form (Title, Description, Status, Priority, Due Date).
   - **Read & Filter:** Users see a modern, responsive list of their tasks and can filter them by status via intuitive tabs.
   - **Update:** Users can edit existing tasks (e.g., changing status to "In Progress").
   - **Delete:** Users can safely remove tasks with a confirmation prompt.
3. **Session:** If the session expires or the user logs out, they are securely routed back to the login screen, and local state is cleared.

## 📂 Monorepo Structure

```text
ops-forge/
├── apps/
│   ├── backend/       # NestJS API (Port 3000)
│   └── frontend/      # React SPA (Port 5173)
├── packages/
│   ├── database/      # graphile-migrate up/down scripts & root DB connection
│   └── shared-types/  # Auto-generated Kysely DB types shared across apps
├── tests/             # End-to-end integration tests using bun:test
├── biome.json         # Global linting and formatting configuration
├── package.json       # Monorepo root and common scripts
└── README.md
```

## 🚀 Getting Started Locally

### 1. Prerequisites
- Install **[Bun](https://bun.sh)** (v1.x)
- Install **Docker** & Docker Compose (for PostgreSQL)

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# /ops-forge/.env

DATABASE_URL=postgres://devdb:password@localhost:5433/ops_forge
SHADOW_DATABASE_URL=postgres://devdb:password@localhost:5433/ops_forge_shadow

JWT_SECRET=super-secret-dev-key-12345
CORS_ORIGIN=http://localhost:5173
```

Similarly, create a `.env` explicitly for the frontend inside `apps/frontend`:
```env
# /ops-forge/apps/frontend/.env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Start Database
You can easily spin up a local PostgreSQL instance with Docker using the credentials defined in the `.env` file:
```bash
docker run --name ops-forge-db -e POSTGRES_USER=devdb -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ops_forge -p 5433:5432 -d postgres:15-alpine
```
*(Optionally, you can use any existing local PostgreSQL installation. Just ensure the `DATABASE_URL` port and credentials in `.env` match your setup).*

### 4. Install Dependencies
From the monorepo root:
```bash
bun install
```

### 5. Run Migrations & Seed Data
Initialize the database schemas and insert seed users:
```bash
bun run migrate:reset --erase
bun run migrate:commit -m 'seed-users'
bun run generate-types
```
*Note: We utilize `pgcrypto` for secure, on-the-fly password hashing during user seeding.*

### 6. Start Development Servers
You can spin up both frontend and backend concurrently from the root:
```bash
bun run dev
```
Alternatively, in separate terminal tabs:
- Backend: `bun run dev:backend`
- Frontend: `bun run dev:frontend`

The application will be accessible at: **[http://localhost:5173](http://localhost:5173)**

*Test User Credentials:*
- `admin` / `Admin123!`
- `maria.dev` / `Maria123!`

---

## 🛠️ Typical Development Workflows

### Database Migrations (graphile-migrate)
We use the `current.sql` strategy.
1. Write raw SQL commands inside `packages/database/migrations/current.sql`.
2. Apply and commit the migration:
   ```bash
   bun run migrate:commit -m 'new-feature-tables'
   ```
3. Regenerate TypeScript definitions:
   ```bash
   bun run generate-types
   ```

### Linting & Formatting
Our project relies on Biome for blazingly fast checks.
```bash
bun run lint          # Check formatting and lint rules
bun run lint:fix      # Automatically fix formatting and safe lint fixes
```

### Integration Testing
The project includes a self-contained integration test suite using `bun:test`, which automatically spins up the backend in memory and tests the API flows.

**Prerequisites to running tests:**
1. Your `.env` files must be properly configured.
2. The local database must be running (e.g. via the `docker run` command).
3. The database must be migrated and seeded (`bun run migrate:reset --erase` and `bun run migrate:commit -m 'seed-users'`).

Once the database is ready, you can execute the test suite from the root:
```bash
bun run test
```

---

## ☁️ Deployment

### CI/CD Flow (High Level)
1. A PR to `main` triggers `.github/workflows/ci.yml` (lint + full build).
2. A merge/push to `main` triggers deploy workflows only when relevant paths changed:
   - `.github/workflows/deploy-frontend.yml` for `apps/frontend/**`
   - `.github/workflows/deploy-backend.yml` for `apps/backend/**` and `packages/database/**`
3. Frontend pipeline builds Vite and deploys `dist/` to Cloudflare Pages.
4. Backend pipeline runs production DB migrations, validates generated DB types, then deploys NestJS to AWS Lambda via Serverless Framework.
5. Both deploy workflows use `concurrency` to prevent overlapping production deployments.

### GitHub Actions Workflows
- `ci.yml`: quality gate for PRs/pushes (`bun run lint` + `bun run build`).
- `deploy-frontend.yml`: Cloudflare Pages deployment.
- `deploy-backend.yml`: DB migrations + Serverless deployment to AWS.

### Required GitHub Configuration
Use a protected `production` Environment in GitHub and add:

Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `AWS_DEPLOY_ROLE_ARN`
- `DATABASE_URL`
- `SHADOW_DATABASE_URL`
- `JWT_SECRET`

Variables:
- `VITE_API_URL` (e.g. `https://api.example.com/api/v1`)
- `CORS_ORIGIN` (e.g. `https://opsforge.example.com`)

### AWS Setup (OIDC + Lambda Deploy)
1. Create an IAM OIDC provider for GitHub (`token.actions.githubusercontent.com`) if not already present.
2. Create an IAM role for deployment (e.g. `ops-forge-gha-deploy`) trusted by GitHub OIDC for your repo/branch/environment.
3. Attach least-privilege policies required by Serverless/Lambda/API Gateway/CloudFormation/IAM PassRole for your stack.
4. Save the role ARN in GitHub as `AWS_DEPLOY_ROLE_ARN`.
5. Ensure `apps/backend/serverless.yml` region/stage conventions match your AWS account strategy.

### Cloudflare Setup (Pages Deploy)
1. Create a Cloudflare Pages project named `ops-forge-frontend`.
2. Generate a Cloudflare API Token with Pages edit permissions for that project/account.
3. Copy `Account ID` from Cloudflare dashboard.
4. Store both values in GitHub as `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
5. Set `VITE_API_URL` in GitHub variables to point to your deployed backend API.
