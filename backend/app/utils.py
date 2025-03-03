def chunk_text(text:str, chunk_size=500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]