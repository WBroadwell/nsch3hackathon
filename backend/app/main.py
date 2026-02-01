"""
Main Application Module

This is the entry point for the CharityMap backend API.
It creates and configures the Flask application, sets up the database,
and starts the development server.

To run: python app/main.py
"""

import os

from auth import auth_bp
from database import db
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from models import User
from routes import bp

# Load environment variables from .env file
load_dotenv()


def create_app():
    """
    Application Factory - Creates and configures the Flask app

    This pattern allows us to create multiple app instances for testing
    and makes the configuration more flexible.
    """
    app = Flask(__name__)

    # Enable CORS (Cross-Origin Resource Sharing) for frontend communication
    # This allows the Next.js frontend to make requests to this API
    CORS(
        app,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        supports_credentials=True,
    )

    # Database configuration - uses PostgreSQL connection string from .env
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Secret key for JWT token signing
    app.config["JWT_SECRET"] = os.getenv(
        "JWT_SECRET", "your-secret-key-change-in-production"
    )

    # Initialize the database with the app
    db.init_app(app)

    # Register route blueprints
    app.register_blueprint(bp)  # Event routes (/events, /my-events)
    app.register_blueprint(auth_bp)  # Auth routes (/auth/*)

    return app


def seed_database():
    """
    Create initial admin user if it doesn't exist.

    This runs on startup to ensure there's always an admin account
    that can create invites for new organizations.
    """
    existing_user = User.query.filter_by(email="broadw@rpi.edu").first()
    if not existing_user:
        user = User(email="broadw@rpi.edu", organization_name="RPI", is_admin=True)
        user.set_password("123456789")
        db.session.add(user)
        db.session.commit()
        print("Created initial admin user: broadw@rpi.edu (RPI)")
    else:
        print("Initial user already exists")


# =============================================================================
# APPLICATION STARTUP
# =============================================================================

if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        # Drop and recreate all tables (for development only)
        # Remove db.drop_all() in production to preserve data
        db.drop_all()
        db.create_all()

        # Create the initial admin user
        seed_database()

    # Start the development server on port 5000
    # host="0.0.0.0" allows connections from other Docker containers
    app.run(host="0.0.0.0", port=5000, debug=True)
