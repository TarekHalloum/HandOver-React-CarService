from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS 
from PIL import Image
import io
import os
import time
from detection import detect_car, detect_damage

app = Flask(__name__)
CORS(app) 
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = 'output'

@app.route('/scan', methods=['POST'])
def scan():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        img = Image.open(io.BytesIO(file.read())).convert('RGB')

        # Run detection and extract metadata
        car_img, brand = detect_car(img)
        final_img, damaged_parts = detect_damage(car_img)

        # Save with unique filename
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        filename = f"result_{int(time.time())}.jpg"
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        final_img.save(output_path)

        full_url = f"http://localhost:8000/output/{filename}"
        return jsonify({
            'message': 'Detection complete',
            'result_url': full_url,
            'brand': brand,
            'damaged_parts': damaged_parts
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/output/<filename>')
def get_output_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=8000)
