# CharityMap

A web application connecting volunteers and donors with local charity events. Users can browse upcoming events and submit their own.

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 16 with React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with rose/pink gradient theme
- **Forms**: React Hook Form
- **UI**: Custom components following shadcn/ui patterns

### Backend (`/backend`)
- **Framework**: Flask 3.1
- **Database**: PostgreSQL via SQLAlchemy ORM
- **API**: RESTful JSON endpoints

## Project Structure

```
├── frontend/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home (/)
│   │   ├── events/page.tsx    # Event listing (/events)
│   │   ├── events/[event]/    # Event details (/events/:id)
│   │   └── addevent/page.tsx  # Create event form (/addevent)
│   ├── components/            # Reusable UI components
│   │   ├── NavigationBar.tsx
│   │   └── ui/card.tsx
│   ├── types/                 # TypeScript interfaces
│   │   ├── Event.tsx          # Event display model
│   │   └── NewEvent.tsx       # Form input model
│   └── lib/utils.ts           # Utility functions (cn helper)
│
├── backend/
│   └── app/
│       ├── main.py            # Flask app factory, config
│       ├── database.py        # SQLAlchemy instance
│       ├── models.py          # Event model definition
│       └── routes.py          # API endpoints (Blueprint)
│
└── .github/workflows/         # CI/CD (ESLint on frontend changes)
```

## Commands

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python app/main.py   # Dev server (localhost:5000)
```

Requires PostgreSQL running. Set `SQLALCHEMY_DATABASE_URI` in `backend/.env`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List all events |
| POST | `/events` | Create event (JSON body) |
| GET | `/events/<id>` | Get single event |

## Environment Variables

### Frontend
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL (default: `http://localhost:5000`)

### Backend
- `SQLALCHEMY_DATABASE_URI` - PostgreSQL connection string

## Key Files Reference

| Purpose | Location |
|---------|----------|
| App configuration | `frontend/next.config.ts:1-7` |
| TypeScript paths | `frontend/tsconfig.json:21-23` |
| Theme colors | `frontend/app/globals.css:1-50` |
| Flask factory | `backend/app/main.py:10-23` |
| Event model | `backend/app/models.py:1-15` |
| API routes | `backend/app/routes.py:8-29` |

## Additional Documentation

Check these files for specialized topics:

| Topic | File |
|-------|------|
| Architectural patterns & conventions | `.claude/docs/architectural_patterns.md` |

## Notes

- All frontend pages use `"use client"` directive for interactivity
- Form field names differ from API (`eventName` → `name`, `eventHost` → `host`)
- Backend runs `db.drop_all()` on startup (development mode)
- Brand colors: rose-500 (`#f43f5e`) to pink-500 (`#ec4899`) gradient
