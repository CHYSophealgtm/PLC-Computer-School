# Deployment Guide (Supabase + Vercel)

This project has been fully configured for deployment on Vercel using Supabase (PostgreSQL) as the backend database. Follow these steps to deploy your application.

## 1. Setup Supabase (Database)

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once created, go to **Project Settings -> Database**.
3. Scroll down to **Connection parameters** or **Connection String** (URI).
4. You need two connection strings:
   - **Transaction (Connection Pooling):** Used by the app to handle many connections. Usually has port `6543`.
   - **Session (Direct Connection):** Used by Prisma to push schema changes. Usually has port `5432`.

*Note: Replace `[YOUR-PASSWORD]` with your actual database password.*

## 2. Local Environment Setup (Optional but recommended)

Before deploying, push the database schema to your Supabase project:

1. Create a `.env` file in the root of your project:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   JWT_SECRET="your_custom_secure_secret_key"
   ```
2. Run the database push command to create tables in Supabase:
   ```bash
   npx prisma db push
   ```

## 3. Deploy to Vercel

1. Push your code to a **GitHub** repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New -> Project**.
3. Import your GitHub repository.
4. **Important:** Before clicking Deploy, expand the **Environment Variables** section and add:
   - `DATABASE_URL` : *(The Transaction pooling URL from step 1)*
   - `DIRECT_URL` : *(The Session direct URL from step 1)*
   - `JWT_SECRET` : *(A secure random string for user authentication)*
5. The Build Command is already configured in `package.json` (`npm run build`). Vercel will automatically generate the Prisma client, build the React app, and bundle the Express server.
6. Click **Deploy**.

## 4. How the Serverless Backend Works

This app uses a custom setup to run a full Express backend on Vercel Serverless Functions:
- The `vercel.json` file routes all `/api/*` requests to the `api/index.js` file.
- The `api/index.js` file imports the bundled Express server (`dist/server.cjs`) generated during the build process.
- All non-API requests route to `index.html` for the React Single Page Application (SPA).
