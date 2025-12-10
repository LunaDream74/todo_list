# 🚀 Quick Start: Using Your Database

## ⚡ 30-Second Summary

Your Neon database is fully configured and ready to use!

```typescript
// 1. Import Prisma
import prisma from '@/lib/db';

// 2. Create a user
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
  },
});

// 3. Create a todo
const todo = await prisma.todo.create({
  data: {
    text: 'Learn Prisma',
    deadline: '2025-12-25',
    userId: user.id,
  },
});

// 4. Query with relations
const userWithTodos = await prisma.user.findUnique({
  where: { id: user.id },
  include: { todos: true },
});
```

---

## 📝 Database Schema

### User Table
| Column | Type | Details |
|--------|------|---------|
| id | Int | Primary key, auto-increment |
| name | String | User's name |
| email | String | Unique, required |
| password | String | Hashed password |
| image | String? | Optional profile image URL |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Todo Table
| Column | Type | Details |
|--------|------|---------|
| id | Int | Primary key, auto-increment |
| text | String | Task description |
| deadline | String | Date (YYYY-MM-DD format) |
| status | String | "pending" or "done" (default: "pending") |
| finishedTime | String? | ISO timestamp when completed |
| userId | Int | Foreign key → User.id |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

---

## 🎯 Common Operations

### Create a User
```typescript
const user = await prisma.user.create({
  data: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashed_password',
    image: 'https://example.com/avatar.jpg',
  },
});
```

### Create a Todo
```typescript
const todo = await prisma.todo.create({
  data: {
    text: 'Buy groceries',
    deadline: '2025-12-20',
    status: 'pending',
    userId: 1, // Reference to user
  },
});
```

### Get All Todos
```typescript
const allTodos = await prisma.todo.findMany();

// With user details
const todosWithUser = await prisma.todo.findMany({
  include: { user: true },
});

// Filtered
const pendingTodos = await prisma.todo.findMany({
  where: { status: 'pending' },
});

// Sorted
const sortedTodos = await prisma.todo.findMany({
  orderBy: { deadline: 'asc' },
});
```

### Get User with Todos
```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { todos: true },
});
```

### Update a Todo
```typescript
const updated = await prisma.todo.update({
  where: { id: 1 },
  data: {
    status: 'done',
    finishedTime: new Date().toISOString(),
  },
});
```

### Delete a Todo
```typescript
await prisma.todo.delete({
  where: { id: 1 },
});
```

### Delete a User (cascade deletes todos)
```typescript
await prisma.user.delete({
  where: { id: 1 },
});
```

---

## 🔌 Integration Steps

### Step 1: Create an API Route
**File**: `app/api/todos/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const { text, deadline, userId } = await request.json();
  const todo = await prisma.todo.create({
    data: { text, deadline, userId },
  });
  return NextResponse.json(todo);
}
```

### Step 2: Call from Client Component
```typescript
'use client';

import { useEffect, useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

---

## 📊 Database Connection

Your `.env` file already contains:
```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

- **Provider**: Neon (Serverless Postgres)
- **SSL**: Enabled for security
- **Pooling**: Enabled for performance
- **Configuration**: In `prisma.config.ts`

---

## 🛠️ Helpful Commands

```bash
# View your database in a web UI
npx prisma studio

# Create a migration (if using migrations)
npx prisma migrate dev --name your_migration_name

# Push schema changes
npx prisma db push

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset

# View schema
cat prisma/schema.prisma
```

---

## ✅ What's Already Done

- ✅ Prisma installed and configured
- ✅ Schema created with User and Todo models
- ✅ Tables created in Neon database
- ✅ Prisma client generated
- ✅ Environment variables configured
- ✅ lib/db.ts ready for imports

---

## 🎓 Next Steps

1. **Create API Routes** for CRUD operations
2. **Fetch data** from API routes in components
3. **Replace mock data** with real database data
4. **Add authentication** for user login
5. **Deploy** to production

---

## 📞 Need Help?

### Test Database Connection
```bash
npx prisma studio
# Opens web UI to view your database
```

### Check Schema
```bash
cat prisma/schema.prisma
```

### Verify Prisma Client
```bash
ls lib/prisma/
```

---

**Your database is ready! Start building! 🚀**
