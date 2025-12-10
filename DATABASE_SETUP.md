# Database Setup Guide: Neon + Prisma

## ✅ Setup Complete

Your Neon Serverless Postgres database connection is already configured in `.env`:

```env
DATABASE_URL=postgresql://neondb_owner:npg_VU7yHQkeP1qJ@ep-gentle-math-adpa43x7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 📋 Database Schema

The Prisma schema has been created with two models:

### User Model
- `id` - Auto-incrementing integer (primary key)
- `name` - String
- `email` - String (unique)
- `password` - String
- `image` - Optional string (profile image URL)
- `createdAt` - Timestamp (auto-generated)
- `updatedAt` - Timestamp (auto-updated)
- Relation: One-to-many with Todo

### Todo Model
- `id` - Auto-incrementing integer (primary key)
- `text` - String (task description)
- `deadline` - String (date in YYYY-MM-DD format)
- `status` - String (default: "pending", can be "pending" or "done")
- `finishedTime` - Optional string (ISO timestamp when task was completed)
- `userId` - Foreign key (references User.id)
- `createdAt` - Timestamp (auto-generated)
- `updatedAt` - Timestamp (auto-updated)
- Relation: Many-to-one with User (with cascade delete)

## 🚀 Next Steps

### 1. Verify Your .env File

Ensure your `.env` file contains the DATABASE_URL from Neon. You can get this from:
1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Select your project
3. Go to Connection Details
4. Copy the connection string
5. Paste it as `DATABASE_URL` in `.env`

### 2. Push Schema to Database

Run this command to create tables in your Neon database:

```bash
npx prisma db push
```

This will:
- Create the `User` table
- Create the `Todo` table
- Set up all relationships and constraints
- No migrations are created (good for development)

### 3. Generate Prisma Client

```bash
npx prisma generate
```

This creates the type-safe Prisma Client for use in your application.

### 4. View Your Database (Optional)

Open Prisma Studio to view and manage your data:

```bash
npx prisma studio
```

This opens a web UI where you can:
- View all tables
- Create/edit/delete records
- Explore relationships

## 🔄 Workflow for Future Schema Changes

If you need to modify the schema:

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Run `npx prisma generate` to regenerate Prisma Client

## 📌 Important Notes

- **Sensitive Data**: Your .env file contains credentials. Never commit it to Git.
- **Cascade Delete**: When a User is deleted, all their associated Todos are automatically deleted.
- **Timestamps**: `createdAt` and `updatedAt` are automatically managed by Prisma.
- **SSL Connection**: The connection string uses `sslmode=require` for secure communication.

## 🛠️ Useful Commands

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (web UI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# View database schema
npx prisma db execute --stdin < schema.sql
```

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Neon Docs](https://neon.tech/docs/)
- [Neon + Prisma Setup](https://neon.tech/docs/guides/prisma)
