# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/check_pronunciation', methods=['POST'])
def check_pronunciation():
    if 'audio' not in request.files or 'target_phrase' not in request.form:
        return jsonify({"error": "Missing target_phrase or audio file"}), 400
    
    target_phrase = request.form['target_phrase']
    audio = request.files['audio']


    
    return jsonify({"message": "Muy bien. Podrias intentar mejorar la entonación.", "target_phrase": target_phrase})

if __name__ == '__main__':
    app.run(debug=True)
