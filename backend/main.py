from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import difflib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust origins in production for security
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/compare")
async def compare_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    # Read and decode file contents as lists of lines
    content1 = (await file1.read()).decode('utf-8').splitlines()
    content2 = (await file2.read()).decode('utf-8').splitlines()

    # Join lines back to strings for overall similarity calculation
    text1 = '\n'.join(content1)
    text2 = '\n'.join(content2)

    # Calculate overall similarity ratio on full text strings
    matcher = difflib.SequenceMatcher(None, text1, text2)
    similarity = round(matcher.ratio() * 100, 2)

    # Find lines in content1 that approximately match any line in content2 (80%+ similarity)
    matched_lines = []
    for line1 in content1:
        for line2 in content2:
            ratio = difflib.SequenceMatcher(None, line1.strip().lower(), line2.strip().lower()).ratio()
            if ratio > 0.8:
                matched_lines.append(line1)
                break

    return JSONResponse(content={
        "similarity": similarity,
        "matched_lines": matched_lines
    })
