from docling.document_converter import DocumentConverter
from fastapi import FastAPI,UploadFile,File, HTTPException
from fastapi.responses import JSONResponse
# from openai import OpenAI
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware
import sys
import time
print(sys.executable)
from dotenv import load_dotenv
from pydantic import BaseModel
import requests
import os
from uuid import uuid4

from .models.embeddings import EmbeddingModel
from .models.faiss_indexer import FAISSIndexer
from .utils import chunk_text


embedder = EmbeddingModel()
indexer = FAISSIndexer()
document_store = {}


load_dotenv()
print(os.getenv("DEEPSEEK_API_KEY"))
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Study Buddy!"}


@app.post("/parse")
async def upload_pdf(file: UploadFile = File(...)):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_file_path,"wb") as buffer:

            # shutil.copyfileobj(file.file, buffer)
            
            # time.sleep(0.5)
            # os.remove(temp_file_path)

            content = await file.read()
            buffer.write(content)
            await file.close()
            converter = DocumentConverter()
            result =  converter.convert(temp_file_path)
            parsed_content = result.document.export_to_markdown()

            doc_id = str(uuid4())
            
            #embedding parsed content
            chunks = chunk_text(parsed_content)
            print(chunks)
            embeddings = embedder.embed_text(chunks)
            print(embeddings)

            #storeing in FAISS
            indexer.doc_chunks = chunks
            indexer.create_index(embeddings)

            max_retries = 3
            for attempt in range(max_retries):
                try:
                    time.sleep(0.5)
                    os.remove(temp_file_path)
                    break
                except PermissionError:
                    if attempt == max_retries - 1:
                        print(f"Warning: Could not delete temprory file {temp_file_path}")  
                    continue  
            document_store[doc_id]={
                "index":indexer,
                "chunks":chunks
            }
            print(f"Stored document {doc_id} with {len(chunks)} chunks")
            return JSONResponse(content={"document_id": doc_id}, status_code=200)
        

    except Exception as e:
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except:
                print(f"Warning: could not delete temporary file{temp_file_path}")
        raise HTTPException(status_code=500, detail=str(e))
    

# client = OpenAI(
#     api_key=os.getenv('DEEPSEEK_API_KEY'),
#     base_url="https://api.deepseek.com"
# )

class QuestionRequest(BaseModel):
    question: str
    document_id: str

# @app.post("/ask")
# async def ask_question(request: QuestionRequest):
#     try:
#         doc_id = request.document_id
#         if doc_id not in document_store:
#             raise HTTPException(status_code=404, detail= "Document not found")
        
#         doc_data = document_store[doc_id]
#         indexer = doc_data["index"]

#         #question embedding
#         query_embedding  =embedder.embed_text([request.question])

#         #search faiss
#         relevant_chunks = indexer.search(query_embedding)
        
        

#         context = "\n".join(relevant_chunks)[:2000]
        
#         messages = [
#             {"role":"user","content":f"Based on this document: {context}\n Provide a concise and well-structured answer as a tutor explaining key points to a student.Summarize only the essential details in a clear and precise manner.\n Question: {request.question} Answer:"}
#         ]

#         response = client.chat.completions.create(
#             model="deepseek-chat",
#             messages=messages
#         )

#         return{"answer": response.choices[0].message.content}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



@app.post("/context")
async def ask_question(request: QuestionRequest):
    try:
        doc_id = request.document_id
        if doc_id not in document_store:
            raise HTTPException(status_code=404, detail= "Document not found")
        
        doc_data = document_store[doc_id]
        indexer = doc_data["index"]

        #question embedding
        query_embedding  =embedder.embed_text([request.question])

        #search faiss
        relevant_chunks = indexer.search(query_embedding)
        
        

        context = "\n".join(relevant_chunks)[:2000]
        
        

        return{"context": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
