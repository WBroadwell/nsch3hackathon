from flask import Flask
from flask_cors import CORS
from database import db
from routes import bp
from auth import auth_bp
from models import User
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        supports_credentials=True
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET"] = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")

    db.init_app(app)

    app.register_blueprint(bp)
    app.register_blueprint(auth_bp)

    return app


def seed_database():
    """Create initial user if not exists"""
    # Check if user already exists
    existing_user = User.query.filter_by(email="broadw@rpi.edu").first()
    if not existing_user:
        user = User(
            email="broadw@rpi.edu",
            organization_name="RPI"
        )
        user.set_password("123456789")
        db.session.add(user)
        db.session.commit()
        print("Created initial user: broadw@rpi.edu (RPI)")
    else:
        print("Initial user already exists")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.drop_all()  # For debugging and table changes
        db.create_all()
        seed_database()
    app.run(debug=True)