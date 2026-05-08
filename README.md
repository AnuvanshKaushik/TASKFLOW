# TaskFlow AI

TaskFlow AI is a full-stack SaaS-style team task manager built with a custom React dashboard, Express API, MongoDB relationships, JWT authentication, and role-based access control.

## Architecture

```txt
TASKFLOW_AI/
  backend/
    src/
      config/          Environment and database setup
      controllers/     Auth, users, projects, tasks, analytics
      middleware/      Auth, RBAC, validation, errors
      models/          User, Project, Task, Activity schemas
      routes/          REST API route modules
      utils/           JWT, async handlers, API errors
      validators/      Zod request schemas
    .env.example
    railway.json
  frontend/
    src/
      components/      Layout, dashboard, project, task, UI primitives
      context/         Auth, theme, toast providers
      hooks/           Reusable React hooks
      pages/           Auth, dashboard, projects, tasks, team, settings
      routes/          Protected/public route guards
      services/        Axios API clients
      types/           Shared frontend TypeScript models
      utils/           Formatting and class helpers
    .env.example
    vercel.json
```

## Features

- Signup plus separate Admin Login and Member Login flows with JWT, bcrypt password hashing, persistent sessions, protected routes, and logout.
- Admin and Member roles with server-side RBAC.
- Admins can create/edit/delete projects, assign team members, create/edit/delete tasks, and view analytics.
- Members can view assigned projects and update statuses for their own tasks.
- Animated dashboard with stats, charts, workload, overdue work, progress bars, activity timeline, loading skeletons, and empty states.
- Project cards, modern modal forms, task board filters, search, sorting, dark/light theme, profile menu, responsive sidebar, and toast notifications.

## Local Setup

1. Install all dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Fill `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskflow-ai
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
ALLOW_ROLE_SELECTION=false
```

4. Start both apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`

Backend health: `http://localhost:5000/health`

The first registered user becomes `Admin`. Later users become `Member` unless `ALLOW_ROLE_SELECTION=true`.

## API Routes

Base URL: `/api`

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Register user |
| POST | `/auth/login` | Public | Generic login |
| POST | `/auth/admin-login` | Public | Admin-only login |
| POST | `/auth/member-login` | Public | Member-only login |
| GET | `/auth/me` | Auth | Current user |
| POST | `/auth/logout` | Auth | Stateless logout response |
| GET | `/users` | Auth | List team members |
| PATCH | `/users/me` | Auth | Update profile |
| PATCH | `/users/:id/role` | Admin | Change role |
| GET | `/projects` | Auth | List visible projects |
| GET | `/projects/:id` | Auth | Project detail |
| POST | `/projects` | Admin | Create project |
| PATCH | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project and tasks |
| POST | `/projects/:id/members` | Admin | Add member |
| DELETE | `/projects/:id/members` | Admin | Remove member |
| GET | `/tasks` | Auth | Search/filter/sort visible tasks |
| GET | `/tasks/:id` | Auth | Task detail |
| POST | `/tasks` | Admin | Create task |
| PATCH | `/tasks/:id` | Auth/RBAC | Admin edits task, assigned member updates status |
| PATCH | `/tasks/:id/status` | Auth/RBAC | Update status |
| DELETE | `/tasks/:id` | Admin | Delete task |
| GET | `/analytics/dashboard` | Auth | Dashboard analytics |

## Deployment

Frontend deploys to Vercel from `frontend/`.

- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_API_URL=https://your-railway-api.up.railway.app/api`

Backend deploys to Railway from `backend/`.

- Build command: `npm run build`
- Start command: `npm run start`
- Required variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`

MongoDB Atlas works with the `MONGO_URI` connection string in `backend/.env`.

## Verification

```bash
npm run build --prefix backend
npm run build --prefix frontend
```

Use `backend/API_EXAMPLES.http` with the VS Code REST Client extension or copy requests into Postman/Insomnia.
