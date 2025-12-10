'use server';

import { auth } from '@/auth';
import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Get all todos for the current user
export async function getTodos() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const result = await query(
    'SELECT id, text, deadline, status, "finishedTime", "userId" FROM "Todo" WHERE "userId" = $1 ORDER BY deadline ASC',
    [parseInt(session.user.id)]
  );

  return result.rows;
}

// Create a new todo
export async function createTodo(text: string, deadline: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const result = await query(
    'INSERT INTO "Todo" (text, deadline, "userId", status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
    [text, deadline, parseInt(session.user.id), 'pending']
  );

  revalidatePath('/');
  return result.rows[0];
}

// Update a todo
export async function updateTodo(
  id: number,
  text: string,
  deadline: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Verify the todo belongs to the user
  const todoResult = await query(
    'SELECT id, "userId" FROM "Todo" WHERE id = $1',
    [id]
  );

  const todo = todoResult.rows[0];

  if (!todo || todo.userId !== parseInt(session.user.id)) {
    throw new Error('Unauthorized: Cannot update this todo');
  }

  const result = await query(
    'UPDATE "Todo" SET text = $1, deadline = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
    [text, deadline, id]
  );

  revalidatePath('/');
  return result.rows[0];
}

// Toggle todo status
export async function toggleTodoStatus(id: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Verify the todo belongs to the user
  const todoResult = await query(
    'SELECT id, "userId", status FROM "Todo" WHERE id = $1',
    [id]
  );

  const todo = todoResult.rows[0];

  if (!todo || todo.userId !== parseInt(session.user.id)) {
    throw new Error('Unauthorized: Cannot update this todo');
  }

  const newStatus = todo.status === 'pending' ? 'done' : 'pending';
  const finishedTime = newStatus === 'done' ? new Date().toISOString() : null;

  const result = await query(
    'UPDATE "Todo" SET status = $1, "finishedTime" = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
    [newStatus, finishedTime, id]
  );

  revalidatePath('/');
  return result.rows[0];
}

// Delete a todo
export async function deleteTodo(id: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Verify the todo belongs to the user
  const todoResult = await query(
    'SELECT id, "userId" FROM "Todo" WHERE id = $1',
    [id]
  );

  const todo = todoResult.rows[0];

  if (!todo || todo.userId !== parseInt(session.user.id)) {
    throw new Error('Unauthorized: Cannot delete this todo');
  }

  await query('DELETE FROM "Todo" WHERE id = $1', [id]);

  revalidatePath('/');
}

// Get current user
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}
