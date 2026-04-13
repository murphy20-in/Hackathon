 To Run

  # Backend (Terminal 1)
  cd backend
  source .venv/bin/activate
  uvicorn app.main:app --reload --port 8000

  # Frontend (Terminal 2)
  cd frontend
  npm install
  npm run web

  # Access
  # - Frontend: http://localhost:8081
  # - Backend API: http://localhost:8000/api
  # - API Docs: http://localhost:8000/docs

  # Database
  # - PostgreSQL with 157K crime records loaded
  # - DB: saferoute, User: postgres, Password: Kaarthikeya@0207
  # - Reinit: python -m app.database.init_db

