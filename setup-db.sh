#!/bin/bash

# Setup Database Script untuk SIPALMI Next.js
# Script ini akan membantu setup database PostgreSQL

echo "🚀 SIPALMI Database Setup"
echo "========================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL tidak ditemukan!"
    echo "   Silakan install PostgreSQL terlebih dahulu:"
    echo "   brew install postgresql@14"
    exit 1
fi

echo "✅ PostgreSQL ditemukan: $(psql --version)"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "⚠️  PostgreSQL service tidak running"
    echo "   Mencoba start PostgreSQL service..."
    
    # Try to start PostgreSQL
    if command -v brew &> /dev/null; then
        brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null
        sleep 3
    fi
    
    if ! pg_isready -q; then
        echo "❌ Gagal start PostgreSQL service"
        echo "   Silakan start manual:"
        echo "   brew services start postgresql@14"
        exit 1
    fi
fi

echo "✅ PostgreSQL service running"
echo ""

# Get database credentials
echo "📝 Masukkan kredensial PostgreSQL:"
read -p "Username (default: $(whoami)): " DB_USER
DB_USER=${DB_USER:-$(whoami)}

read -sp "Password (kosongkan jika tidak ada password): " DB_PASS
echo ""

read -p "Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

DB_NAME="siipalmi"

# Create database
echo ""
echo "📦 Membuat database '$DB_NAME'..."

export PGPASSWORD="$DB_PASS"
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "SELECT 1" &>/dev/null; then
    # Check if database exists
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        echo "✅ Database '$DB_NAME' sudah ada"
    else
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ Database '$DB_NAME' berhasil dibuat"
        else
            echo "❌ Gagal membuat database"
            exit 1
        fi
    fi
else
    echo "❌ Gagal connect ke PostgreSQL"
    echo "   Pastikan kredensial benar dan service running"
    exit 1
fi

# Update .env file
echo ""
echo "📝 Update file .env..."

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

if [ -f .env ]; then
    # Update DATABASE_URL if exists, otherwise append
    if grep -q "^DATABASE_URL=" .env; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" .env
        else
            sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" .env
        fi
    else
        echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env
    fi
    echo "✅ .env file updated"
else
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
    echo "✅ .env file created"
fi

# Generate Prisma Client
echo ""
echo "🔧 Generate Prisma Client..."
npm run prisma:generate

# Run Migrations
echo ""
echo "📊 Running migrations..."
npm run prisma:migrate

# Seed Database
echo ""
read -p "🌱 Seed database dengan admin default? (y/n): " SEED_DB
if [[ $SEED_DB == "y" || $SEED_DB == "Y" ]]; then
    echo "Seeding database..."
    npm run prisma:seed
    echo "✅ Database seeded"
    echo ""
    echo "Admin credentials:"
    echo "  Username: admin"
    echo "  Password: admin123"
fi

echo ""
echo "✅ Setup selesai!"
echo ""
echo "Selanjutnya, jalankan:"
echo "  npm run dev"
echo ""

unset PGPASSWORD
