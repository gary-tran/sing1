#!/bin/bash

if ! command -v psql &> /dev/null
then
    echo "psql (PostgreSQL) is not installed. Please install it and try again."
    exit 1
fi

if ! command -v python3 &> /dev/null
then
    echo "python3 is not installed. Please install python3 and try again."
    exit 1
fi

echo "Setting up the database..."
# Replace your_username with your PostgreSQL username
psql -U your_username -d postgres -f backend/scripts/setup_database.sql

echo "Populating the database..."
myenv/bin/python3 backend/scripts/populate_database.py

echo "Database setup is complete."