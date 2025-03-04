import faiss
import numpy as np

class FAISSIndexer:
    def __init__(self):
        self.index = None
        self.doc_chunks = []
    
    def create_index(self, embeddings:np.ndarray):

        if not isinstance(embeddings, np.ndarray):
            raise ValueError("Embeddings must be nump array")
        
        if embeddings.ndim != 2:
            raise ValueError("Embeddings must be 2d array")
        
        d = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(d)
        self.index.add(embeddings.astype('float32'))
        print(f"Created FAISS index with {embeddings.shape[0]} vectors") 
        
    def search(self, query_embedding, k=3):
        D, I = self.index.search(query_embedding.astype('float32'), k)
        return [self.doc_chunks[i] for i in I[0]]
