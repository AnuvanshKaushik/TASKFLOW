# Railway Deployment Guide

## 1. Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow Railway outbound access by setting Network Access to `0.0.0.0/0`, or use your preferred restricted access policy.
4. Copy your connection string and replace the username, password, and database name.

## 2. Create Railway Service

1. Open Railway and create a new project.
2. Choose deployment from GitHub.
3. Set the root directory to `backend`.
4. Railway will use `railway.json`.

## 3. Environment Variables

Set these in Railway:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskflow-ai
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-domain.vercel.app
ALLOW_ROLE_SELECTION=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

If Vercel has preview deployments, add every allowed frontend origin to `CLIENT_URL` as a comma-separated list.

## 4. Build And Start

Railway commands:

```bash
npm install
npm run build
npm run start
```

Health check:

```txt
/health
```

## 5. Connect Vercel

In Vercel, set:

```env
VITE_API_URL=https://your-railway-service.up.railway.app/api
```

Redeploy the frontend after adding the API URL.

