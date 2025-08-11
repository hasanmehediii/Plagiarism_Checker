import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import docx

app = Flask(__name__)
CORS(app)

def get_text(file):
    """Extract text from a file (PDF, DOCX, or TXT)."""
    text = ""
    if file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(file.stream)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    elif file.filename.endswith('.docx'):
        doc = docx.Document(file.stream)
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif file.filename.endswith('.txt'):
        text = file.stream.read().decode('utf-8')
    return text

def preprocess_text(text):
    """Convert text to lowercase, remove punctuation, and tokenize into words."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text) # Remove punctuation
    words = set(text.split()) # Use a set for unique words
    return words

def jaccard_similarity(set1, set2):
    """Calculate Jaccard Similarity between two sets."""
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    if union == 0:
        return 0.0
    return intersection / union

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze two documents for plagiarism."""
    if 'file1' not in request.files or 'file2' not in request.files:
        return jsonify({"error": "Two files are required."}),

    file1 = request.files['file1']
    file2 = request.files['file2']

    if file1.filename == '' or file2.filename == '':
        return jsonify({"error": "Two files are required."}),

    try:
        text1 = get_text(file1)
        text2 = get_text(file2)

        if not text1 or not text2:
            return jsonify({"error": "Could not extract text from one or both files. Make sure they are not empty or corrupted."}),

        words1 = preprocess_text(text1)
        words2 = preprocess_text(text2)

        score = jaccard_similarity(words1, words2) * 100

        return jsonify({"similarity_score": score})

    except Exception as e:
        return jsonify({"error": str(e)}),