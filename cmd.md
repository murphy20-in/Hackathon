 To Run

  # Backend (Terminal 1)
  cd backend
  source .venv/bin/activate   # Or: pip install -r requirements.txt
  uvicorn app.main:app --reload --port 8000

  # Frontend (Terminal 2)
  cd frontend
  npm install
  ./node_modules/.bin/expo start --web

  # Access
  # - Frontend: http://localhost:8081
  # - Backend API: http://localhost:8000/api
  # - API Docs: http://localhost:8000/docs

  # Notes
  # - Database (SQLite) is pre-initialized with 157K crime records
  # - If database needs init: python -m app.database.init_db
  # - Port conflicts: kill processes on port 8000 or 8081