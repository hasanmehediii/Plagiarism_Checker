# Plagiarism Checker

This is a simple Copy Checker app with a React frontend and FastAPI backend.  
It allows you to upload two text files and checks their similarity, highlighting matched lines.

---

## Prerequisites

- Python 3.7+
- Node.js and npm
- Git (optional)

---

## Backend Setup (FastAPI)

1. Navigate to the backend directory:

    ```bash
    cd backend
2. (Optional) Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
3. Install dependencies:
    ```bash
    pip install fastapi uvicorn python-multipart
4. Run Backend Server:
    ```bash
    uvicorn main:app --reload
## Frontend Setup (React)

1. Navigate to the frontend directory:

    ```bash
    cd frontend
2. Install dependencies:
    ```bash
    npm install
4. Run frontend development Server:
    ```bash
    npm start
# Usage:
- Open the frontend in your browser.
- Upload two text files using the upload buttons.
- Click Start Scanning.
- The similarity percentage and matched lines will display.
# Notes
- Make sure the backend server is running before using the frontend.
- The backend supports CORS, so frontend and backend can run on different ports locally.
