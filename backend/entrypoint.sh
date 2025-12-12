#!/bin/sh
echo "Running database seed..."
npm run seed
echo "Starting application..."
exec "$@"