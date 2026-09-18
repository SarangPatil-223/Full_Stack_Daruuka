# Full Stack Daruuka

This is the full stack repository for the Daruuka project.

## Project Architecture

The project consists of three main components:
1.  **Frontend**: A modern web application built with React, Vite, and Mapbox GL for geospatial data visualization.
2.  **Backend**: A robust RESTful API built with Python and FastAPI, handling business logic, authentication, and database interactions.
3.  **Database**: A PostgreSQL database equipped with the PostGIS extension for advanced spatial data storage and querying capabilities.

## Technology Stack

### Frontend
- **Framework**: React (v19)
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Maps**: Mapbox GL JS & @mapbox/mapbox-gl-draw
- **Charts**: Chart.js & react-chartjs-2
- **Icons**: Lucide React
- **Styling/Linting**: Prettier, Oxlint

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy (v2.0) & GeoAlchemy2 for spatial queries
- **Migrations**: Alembic
- **Database Driver**: psycopg2-binary
- **Authentication**: python-jose (JWT), passlib (bcrypt)
- **Data Validation**: Pydantic

### Database & Infrastructure
- **Database Engine**: PostgreSQL 15
- **Spatial Extension**: PostGIS 3.3
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- Docker & Docker Compose (for the database)

### Database Setup
1. Ensure Docker is running.
2. From the root of the project, start the database service:
   ```bash
   docker-compose up -d
   ```
   The database will be available on port 5432.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations to initialize the database schema:
   ```bash
   alembic upgrade head
   ```
5. Start the backend development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the frontend application in your browser (usually at `http://localhost:5173`).

## Git Hooks & Linting
This project uses Husky for Git pre-commit hooks to ensure code quality. To make sure hooks are properly installed locally, run the following from the root directory:
```bash
npm install
npm run prepare
```
