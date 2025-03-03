creat a virtual enviornment in the backend:
->cd backend
-> python3.11 -m venv parse

activate the virtual enviornment:
-> parse/Scripts/acivate

Install all the dependencies, libraries, packages in the virtual enviornment:
->pip install fastapi uvicorn faiss-cpu sentence-transformers docling python-multipart

start the server:(probably loclhost 8000)
-> uvicorn app.app:app --reload
