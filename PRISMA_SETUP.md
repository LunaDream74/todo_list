# Neon + Prisma Setup - Quick Reference

## ✅ Completed Setup

Your To-Do List application is now connected to a real Neon Serverless Postgres database!

### What Was Done:

1. ✅ **Installed Prisma**: `@prisma/client` and `prisma` packages
2. ✅ **Initialized Prisma**: Created `prisma/` directory and configuration
3. ✅ **Created Schema**: Defined User and Todo models with relationships
4. ✅ **Pushed to Database**: Tables created in your Neon database
5. ✅ **Generated Prisma Client**: Type-safe database client ready to use

---

## 📋 Database Schema Overview

### User Model
```prisma
model User {
  id        Int     @id @default(autoincrement())  // Primary key
  name      String                                   // User's name
  email     String  @unique                          // Unique email
  password  String                                   // Hashed password
  image     String?                                  // Profile image URL (optional)
  
  todos     Todo[]                                   // One-to-many relation
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Todo Model
```prisma
model Todo {
  id          Int     @id @default(autoincrement())  // Primary key
  text        String                                  // Task description
  deadline    String                                  // Date (YYYY-MM-DD)
  status      String  @default("pending")            // "pending" or "done"
  finishedTime String?                               // ISO timestamp when completed
  
  userId      Int                                    // Foreign key
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔑 Key Features

- **Auto-increment IDs**: Both User and Todo have auto-generated integer IDs
- **Unique Email**: User email is enforced as unique across database
- **Relations**: User has many Todos; Todos belong to one User
- **Cascade Delete**: Deleting a user automatically deletes their todos
- **Timestamps**: All records have `createdAt` and `updatedAt` fields
- **Optional Fields**: `image` and `finishedTime` are nullable (optional)

---

## 🌐 Database Connection

Your `.env` file contains:
```env
DATABASE_URL=postgresql://neondb_owner:...@ep-gentle-math-...aws.neon.tech/neondb?sslmode=require
```

This connects to:
- **Provider**: Neon (Serverless Postgres)
- **Database**: neondb
- **SSL**: Required for secure connection
- **Pooling**: Using connection pooler for optimal performance

---

## 📚 Using Prisma in Your App

### Import the Prisma Client:
```typescript
import prisma from '@/lib/db';
```

### Create a User:
```typescript
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
  },
});
```

### Create a Todo:
```typescript
const todo = await prisma.todo.create({
  data: {
    text: 'Complete project',
    deadline: '2025-12-25',
    status: 'pending',
    userId: user.id,
  },
});
```

### Fetch User with Todos:
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { todos: true },
});
```

### Update a Todo:
```typescript
const todo = await prisma.todo.update({
  where: { id: 1 },
  data: {
    status: 'done',
    finishedTime: new Date().toISOString(),
  },
});
```

### Delete a Todo:
```typescript
await prisma.todo.delete({
  where: { id: 1 },
});
```

---

## 🛠️ Useful Commands

```bash
# View database schema in web UI
npx prisma studio

# Push schema changes to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# View database URL
npx prisma db introspect
```

---

## 🔒 Security Notes

- **Never commit `.env`**: This file contains database credentials
- **Use environment variables**: Keep sensitive data in `.env.local` (not tracked by Git)
- **Hash passwords**: Always hash passwords before storing
- **Validate input**: Sanitize user input before database operations
- **Connection pooling**: Already configured in your Neon URL

---

## 📖 Next Steps

Ready to integrate your database with the UI?

1. **Create API Routes** for database operations (`app/api/todos/`, `app/api/users/`)
2. **Update TodoContainer** to fetch/save data from database
3. **Add Authentication** for user login/signup
4. **Move to Server Components** for better performance

See the Next.js documentation for API routes and server components setup.

---

## 📞 Helpful Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon Documentation](https://neon.tech/docs/)
- [Neon + Prisma Guide](https://neon.tech/docs/guides/prisma)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
