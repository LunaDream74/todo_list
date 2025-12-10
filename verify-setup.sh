#!/bin/bash
# Verification Script for Neon + Prisma Setup

echo "🔍 Verifying Neon + Prisma Setup..."
echo ""

# Check for required files
echo "📁 Checking directory structure..."

if [ -d "prisma" ]; then
  echo "✅ prisma/ directory exists"
else
  echo "❌ prisma/ directory not found"
  exit 1
fi

if [ -f "prisma/schema.prisma" ]; then
  echo "✅ schema.prisma exists"
else
  echo "❌ schema.prisma not found"
  exit 1
fi

if [ -f "prisma.config.ts" ]; then
  echo "✅ prisma.config.ts exists"
else
  echo "❌ prisma.config.ts not found"
  exit 1
fi

if [ -f "lib/db.ts" ]; then
  echo "✅ lib/db.ts (Prisma client utility) exists"
else
  echo "❌ lib/db.ts not found"
  exit 1
fi

if [ -d "lib/prisma" ]; then
  echo "✅ lib/prisma/ (Generated Prisma Client) exists"
else
  echo "❌ lib/prisma/ not found - run: npx prisma generate"
  exit 1
fi

echo ""
echo "📋 Checking .env file..."

if [ -f ".env" ]; then
  if grep -q "DATABASE_URL" .env; then
    echo "✅ .env file contains DATABASE_URL"
  else
    echo "❌ .env file missing DATABASE_URL"
    exit 1
  fi
else
  echo "❌ .env file not found"
  exit 1
fi

echo ""
echo "✅ All checks passed! Your setup is ready."
echo ""
echo "Next steps:"
echo "1. Verify database connection: npx prisma studio"
echo "2. Create API routes for database operations"
echo "3. Connect UI components to database"
echo ""
