import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

def get_text(file):
    """Extract text from a file (PDF, DOCX, or TXT)."""
    text = ""
    if file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(file.stream)
        for page in pdf_reader.pages:
            text += page.extract_text()
    elif file.filename.endswith('.docx'):
        doc = docx.Document(file.stream)
        for para in doc.paragraphs:
            text += para.text
    elif file.filename.endswith('.txt'):
        text = file.stream.read().decode('utf-8')
    return text

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze two documents for plagiarism."""
    if 'file1' not in request.files or 'file2' not in request.files:
        return jsonify({"error": "Two files are required."}), 400

    file1 = request.files['file1']
    file2 = request.files['file2']

    if file1.filename == '' or file2.filename == '':
        return jsonify({"error": "Two files are required."}), 400

    try:
        text1 = get_text(file1)
        text2 = get_text(file2)

        if not text1 or not text2:
            return jsonify({"error": "Could not extract text from one or both files. Make sure they are not empty or corrupted."}), 400

        vectorizer = TfidfVectorizer().fit_transform([text1, text2])
        vectors = vectorizer.toarray()
        similarity = cosine_similarity(vectors)
        score = similarity[0][1] * 100

        return jsonify({"similarity_score": score})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
