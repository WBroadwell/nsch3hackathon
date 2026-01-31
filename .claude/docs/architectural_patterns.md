# Architectural Patterns

Patterns and conventions observed across the CharityMap codebase.

## Frontend Patterns

### 1. Client Component Data Fetching

All pages that fetch data follow this pattern:

```
1. "use client" directive at top
2. useState for data storage (null initial state)
3. useEffect with async function for fetch on mount
4. Conditional rendering: loading skeleton → empty state → data
```

**Files using this pattern:**
- `frontend/app/events/page.tsx:17-37`
- `frontend/app/events/[event]/page.tsx:14-28`
- `frontend/app/addevent/page.tsx:10-34`

**Base URL configuration:**
```typescript
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
```

### 2. Loading State Pattern

Skeleton loaders with animated pulse for loading states:

**Files using this pattern:**
- `frontend/app/events/page.tsx:51-60`
- `frontend/app/events/[event]/page.tsx:63-71`

**Structure:**
- Container with `bg-white rounded-2xl shadow-xl`
- Inner elements with `animate-pulse` and `bg-gray-200` or `bg-rose-200`

### 3. Form Handling Pattern

React Hook Form with controlled submission:

**File:** `frontend/app/addevent/page.tsx:36-46`

```
1. useForm<TypeInterface> with defaultValues
2. register() for input binding
3. handleSubmit() wrapper for onSubmit
4. useState for submission status feedback
5. Field mapping from form names to API names
```

### 4. Card-Based UI Pattern

Event cards use consistent structure:

**Files:**
- `frontend/app/events/page.tsx:72-91` (list cards)
- `frontend/app/events/[event]/page.tsx:31-67` (detail card)

**Structure:**
- White background with `rounded-2xl shadow-xl`
- Rose gradient accent (top border or left stripe)
- Icon + label pairs for metadata
- SVG icons inline with `w-5 h-5` or `w-6 h-6`

### 5. Gradient Theme Pattern

Consistent brand colors across all styled pages:

**Primary gradient:** `from-rose-500 to-pink-500`
**Light accent:** `bg-rose-100`, `text-rose-500`
**Page background:** `bg-gradient-to-br from-gray-50 to-gray-100`

**Files using this pattern:**
- `frontend/components/NavigationBar.tsx:8`
- `frontend/app/page.tsx:25-29`
- `frontend/app/events/page.tsx:73`
- `frontend/app/events/[event]/page.tsx:34`
- `frontend/app/addevent/page.tsx:58,113`

### 6. Dynamic Route Params Pattern

Next.js 15+ async params handling:

**File:** `frontend/app/events/[event]/page.tsx:6-11`

```typescript
interface Props {
  params: Promise<{ event: string }>;
}
const { event: eventid } = React.use(params);
```

### 7. Component Composition

Layout structure with shared navigation:

**File:** `frontend/app/layout.tsx`

```
<html>
  <body>
    <NavigationBar />
    {children}
  </body>
</html>
```

## Backend Patterns

### 1. Flask Application Factory

Centralized app creation with configuration:

**File:** `backend/app/main.py:10-23`

```python
def create_app():
    app = Flask(__name__)
    CORS(app, methods=[...])
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(...)
    db.init_app(app)
    app.register_blueprint(bp)
    return app
```

### 2. Blueprint Route Organization

Routes grouped in a Blueprint module:

**File:** `backend/app/routes.py:6`

```python
bp = Blueprint("bp", __name__)

@bp.route("/events", methods=["GET"])
def get_events():
    ...
```

### 3. SQLAlchemy Model Pattern

Single model with typed columns:

**File:** `backend/app/models.py`

```python
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ...
```

### 4. JSON Response Pattern

Consistent response structure:

**File:** `backend/app/routes.py:9-29`

- Success: `jsonify([{...}])` or `jsonify({...})`
- Created: `jsonify({...}), 201`
- Error: `jsonify({"error": "message"}), 400`

Model to dict mapping done inline:
```python
{"id": i.id, "name": i.name, "host": i.host, ...}
```

### 5. Request Data Handling

**File:** `backend/app/routes.py:14-22`

```python
data = request.get_json()
if not data:
    return jsonify({"error": "..."}), 400
# Required: data["field"]
# Optional: data.get("field", default)
```

## Cross-Stack Patterns

### Type Consistency

Frontend types mirror backend model but with different naming in forms:

| Backend (models.py) | Frontend Display (Event.tsx) | Frontend Form (NewEvent.tsx) |
|---------------------|------------------------------|------------------------------|
| `name` | `name` | `eventName` |
| `host` | `host` | `eventHost` |
| `date` | `date` | `date` |
| `location` | `location` | `location` |
| `description` | `description` | `description` |

**Mapping occurs in:** `frontend/app/addevent/page.tsx:20-26`

### Error Handling

- Frontend: console.error + conditional UI
- Backend: HTTP status codes (400, 404) with JSON error messages

No centralized error handling - each component/route handles its own errors.
