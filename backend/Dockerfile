# =============================================================================
# Backend Dockerfile
#
# Multi-stage build for the Flask API server.
# Uses Python 3.11 slim image for smaller container size.
# =============================================================================

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies required for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the Flask port
EXPOSE 5000

# Set the working directory to app folder where main.py is located
WORKDIR /app/app

# Run the Flask application
# Using flask run instead of python main.py for production
CMD ["python", "main.py"]
