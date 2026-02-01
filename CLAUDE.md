# CharityMap

A web application connecting volunteers and donors with local charity events. Users can browse upcoming events, view them on an interactive map, and organizations can submit their own events.

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 16 with React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with rose/pink gradient theme
- **Forms**: React Hook Form
- **Maps**: Leaflet + React-Leaflet with OpenStreetMap tiles
- **UI**: Custom components following shadcn/ui patterns

### Backend (`/backend`)
- **Framework**: Flask 3.1
- **Database**: PostgreSQL via SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API**: RESTful JSON endpoints
- **Linting**: Ruff

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (ESLint for frontend, Ruff for backend)

## Project Structure

```
├── frontend/
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx               # Home (/)
│   │   ├── events/page.tsx        # Event listing (/events)
│   │   ├── events/[event]/        # Event details (/events/:id)
│   │   ├── map/page.tsx           # Interactive map (/map)
│   │   ├── addevent/page.tsx      # Create event form (/addevent)
│   │   ├── signin/page.tsx        # Login (/signin)
│   │   ├── register/page.tsx      # Registration (/register)
│   │   ├── profile/page.tsx       # User profile (/profile)
│   │   └── admin/invites/page.tsx # Admin invite management (/admin/invites)
│   ├── components/
│   │   ├── NavigationBar.tsx      # Header with auth state
│   │   ├── MapComponent.tsx       # Leaflet map with event markers
│   │   └── ui/                    # Reusable UI components
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication state management
│   ├── types/
│   │   ├── Event.tsx              # Event display model
│   │   └── NewEvent.tsx           # Form input model
│   └── lib/utils.ts               # Utility functions
│
├── backend/
│   └── app/
│       ├── main.py                # Flask app factory, config, startup
│       ├── database.py            # SQLAlchemy instance
│       ├── models.py              # User and Event models
│       ├── routes.py              # Event API endpoints
│       └── auth.py                # Auth endpoints and decorators
│
├── docker-compose.yml             # Container orchestration
├── .env.example                   # Environment variable template
└── .github/workflows/             # CI/CD pipelines
```

## Database Schema

### User
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| email | String(120) | Unique, login identifier |
| password_hash | String(255) | Bcrypt hashed password |
| organization_name | String(120) | Displayed as event host |
| is_admin | Boolean | Admin privileges flag |
| invite_code | String(36) | UUID used during registration |

### Event
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| name | String(100) | Event title |
| host | String(100) | Organization name (from user) |
| date | Date | Event date |
| location | String(200) | Address string |
| latitude | Float | Map coordinate (nullable) |
| longitude | Float | Map coordinate (nullable) |
| description | Text | Event details |
| contact_info | String(255) | Organizer contact (nullable) |
| user_id | Integer | Foreign key to User |

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List all events |
| GET | `/events/<id>` | Get single event |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register with invite code |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user info |
| POST | `/auth/create-invite` | Create invite (admin only) |

### Protected (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/events` | Create event |
| PUT | `/events/<id>` | Update own event |
| DELETE | `/events/<id>` | Delete own event |
| GET | `/my-events` | List user's events |

## Commands

### Development
```bash
# Frontend
cd frontend && npm install && npm run dev    # localhost:3000

# Backend
cd backend && pip install -r requirements.txt
python app/main.py                           # localhost:5000
```

### Docker (Production)
```bash
docker compose up --build      # Start all services
docker compose down            # Stop services
docker compose down -v         # Stop and clear database
```

### Linting
```bash
cd frontend && npm run lint              # ESLint
cd backend && ruff check . && ruff format --check .  # Ruff
```

## Environment Variables

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | API URL | `/api` (Docker) or `http://localhost:5000` |
| `INTERNAL_BACKEND_URL` | Proxy target (Docker only) | `http://backend:5000` |

### Backend
| Variable | Description |
|----------|-------------|
| `SQLALCHEMY_DATABASE_URI` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for token signing |

## Architecture Notes

- **Auth Flow**: JWT stored in localStorage, validated via `token_required` decorator
- **Admin System**: Admins create invite codes; users register with valid invite
- **Event Ownership**: Users can only edit/delete their own events; host auto-filled from user
- **Map Features**: Groups overlapping events; filters past events; 50-mile radius filter
- **API Proxy**: In Docker, frontend proxies `/api/*` to backend via Next.js rewrites
- **CORS**: Backend allows all origins for frontend communication

## Key Files Reference

| Purpose | Location |
|---------|----------|
| Auth context & hooks | `frontend/context/AuthContext.tsx` |
| Map with grouped markers | `frontend/components/MapComponent.tsx` |
| JWT decorators | `backend/app/auth.py` |
| Database models | `backend/app/models.py` |
| Docker orchestration | `docker-compose.yml` |
| Next.js proxy config | `frontend/next.config.ts` |

## Notes

- All frontend pages use `"use client"` directive
- Backend runs `db.drop_all()` on startup (development mode only)
- Default admin: `broadw@rpi.edu` / `123456789`
- Brand colors: rose-500 (`#f43f5e`) to pink-500 (`#ec4899`) gradient
