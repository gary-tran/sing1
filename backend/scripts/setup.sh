#!/bin/bash

# Set up the database and tables
echo "Setting up the database..."
psql -U your_username -d postgres -f setup_database.sql

# Run the Python script to populate the database
echo "Populating the database..."
python3 populate_database.py

echo "Database setup complete!"