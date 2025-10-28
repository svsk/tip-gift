#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Run the database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
# "exec" replaces the shell process with the node process
echo "Starting the application..."
exec "$@"A
