from flask import Blueprint, request, jsonify
from models import Event, User
from database import db
from auth import token_required

bp = Blueprint("bp", __name__)


def serialize_event(event):
    return {
        "id": event.id,
        "name": event.name,
        "host": event.host,
        "date": event.date.isoformat(),
        "location": event.location,
        "latitude": event.latitude,
        "longitude": event.longitude,
        "description": event.description,
        "user_id": event.user_id
    }


@bp.route("/events", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify([serialize_event(e) for e in events])


@bp.route("/events", methods=["POST"])
@token_required
def add_event(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400
    print("Received data:", data)
    event = Event(
        name=data["name"],
        host=data.get("host", current_user.organization_name),
        date=data["date"],
        location=data["location"],
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        description=data.get("description", "No description provided."),
        user_id=current_user.id
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(serialize_event(event)), 201


@bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    if not event_id:
        return jsonify({"error": "No event ID provided"}), 400
    event = Event.query.get_or_404(event_id)
    return jsonify(serialize_event(event))


@bp.route("/events/<int:event_id>", methods=["PUT"])
@token_required
def update_event(current_user, event_id):
    event = Event.query.get_or_404(event_id)

    # Check ownership
    if event.user_id != current_user.id:
        return jsonify({"error": "You can only edit your own events"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    event.name = data.get("name", event.name)
    event.host = data.get("host", event.host)
    event.date = data.get("date", event.date)
    event.location = data.get("location", event.location)
    event.latitude = data.get("latitude", event.latitude)
    event.longitude = data.get("longitude", event.longitude)
    event.description = data.get("description", event.description)

    db.session.commit()
    return jsonify(serialize_event(event))


@bp.route("/events/<int:event_id>", methods=["DELETE"])
@token_required
def delete_event(current_user, event_id):
    event = Event.query.get_or_404(event_id)

    # Check ownership
    if event.user_id != current_user.id:
        return jsonify({"error": "You can only delete your own events"}), 403

    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted successfully"})


@bp.route("/my-events", methods=["GET"])
@token_required
def get_my_events(current_user):
    events = Event.query.filter_by(user_id=current_user.id).all()
    return jsonify([serialize_event(e) for e in events])
