from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
import requests
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

def process_image(image_bytes):
    try:
        img = Image.open(BytesIO(image_bytes))
        img_gray = img.convert('L')
        img_byte_arr = BytesIO()
        img_gray.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
        return img_base64
    except Exception as e:
        return str(e)

@app.route('/process-image-url', methods=['POST'])
def process_image_from_url():
    data = request.json
    image_url = data.get('url')
    if not image_url:
        return jsonify({'error': 'No URL provided'}), 400
    
    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Raise HTTPError for bad responses
        img_bytes = response.content
        processed_img = process_image(img_bytes)
        return jsonify({'message': 'Image processed successfully', 'image': processed_img})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Failed to fetch image from URL: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process-image-file', methods=['POST'])
def process_image_from_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        img_bytes = file.read()
        processed_img = process_image(img_bytes)
        return jsonify({'message': 'Image processed successfully', 'image': processed_img})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
