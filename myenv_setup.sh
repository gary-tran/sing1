#!/bin/bash

if ! command -v python3 &> /dev/null
then
    echo "python3 is not installed. Please install python3 and try again."
    exit 1
fi

if ! command -v pip3 &> /dev/null
then
    echo "pip3 not found. Installing pip..."
    python3 -m ensurepip --upgrade
fi

echo "Creating a virtual environment in the 'myenv' directory..."
python3 -m venv myenv

echo "Activating the virtual environment..."
source myenv/bin/activate

echo "Upgrading pip and setuptools..."
pip install --upgrade pip setuptools

echo "Installing dependencies..."
pip install spotipy psycopg2 OpenCC requests pycantonese python-dotenv

echo "Virtual environment 'myenv' setup is complete."
