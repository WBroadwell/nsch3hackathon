from flask import Blueprint, request, jsonify
from models import User, InviteToken
from database import db
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
import secrets

auth_bp = Blueprint("auth", __name__)

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_EXPIRATION_HOURS = 24


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


def generate_token(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=data['email'].lower()).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'organization_name': user.organization_name
        }
    })


@auth_bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    required = ['email', 'password', 'organization_name', 'invite_token']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Verify invite token
    invite = InviteToken.query.filter_by(token=data['invite_token'], used=False).first()
    if not invite:
        return jsonify({'error': 'Invalid or expired invite token'}), 400

    if invite.email.lower() != data['email'].lower():
        return jsonify({'error': 'Email does not match invite'}), 400

    # Check if user already exists
    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'error': 'Email already registered'}), 400

    # Create user
    user = User(
        email=data['email'].lower(),
        organization_name=data['organization_name']
    )
    user.set_password(data['password'])

    # Mark invite as used
    invite.used = True

    db.session.add(user)
    db.session.commit()

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'organization_name': user.organization_name
        }
    }), 201


@auth_bp.route("/auth/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify({
        'id': current_user.id,
        'email': current_user.email,
        'organization_name': current_user.organization_name
    })


@auth_bp.route("/auth/verify-invite/<token>", methods=["GET"])
def verify_invite(token):
    invite = InviteToken.query.filter_by(token=token, used=False).first()
    if not invite:
        return jsonify({'valid': False, 'error': 'Invalid or expired invite token'}), 400
    return jsonify({
        'valid': True,
        'email': invite.email
    })


# Admin route to create invite tokens (in production, protect this or use CLI)
@auth_bp.route("/auth/create-invite", methods=["POST"])
def create_invite():
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'error': 'Email required'}), 400

    # Check if there's already an unused invite for this email
    existing = InviteToken.query.filter_by(email=data['email'].lower(), used=False).first()
    if existing:
        return jsonify({
            'token': existing.token,
            'email': existing.email,
            'message': 'Existing invite token returned'
        })

    token = secrets.token_urlsafe(32)
    invite = InviteToken(
        token=token,
        email=data['email'].lower()
    )
    db.session.add(invite)
    db.session.commit()

    return jsonify({
        'token': token,
        'email': invite.email,
        'invite_url': f"/register?token={token}"
    }), 201
