from flask import Flask, render_template, request, jsonify
from pyzbar.pyzbar import decode
from PIL import Image
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)

# Firebase setup (replace with your credentials and database URL)
cred = credentials.Certificate('firebase_key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://qrsave-4398b-default-rtdb.firebaseio.com/'
})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze_qr', methods=['POST'])
def analyze_qr():
    if 'qr_image' not in request.files:
        return jsonify({'success': False})
    file = request.files['qr_image']
    try:
        img = Image.open(file.stream)
        result = decode(img)
        if result:
            qr_data = result[0].data.decode('utf-8')
            return jsonify({'success': True, 'qr_data': qr_data})
        else:
            return jsonify({'success': False})
    except Exception as e:
        print('Error decoding QR:', e)
        return jsonify({'success': False, 'error': str(e)})

@app.route('/approve_qr', methods=['POST'])
def approve_qr():
    data = request.get_json()
    qr_data = data.get('qr_data')
    if not qr_data:
        return jsonify({'success': False})
    try:
        ref = db.reference('qr_codes')
        ref.push({'data': qr_data})
        return jsonify({'success': True})
    except Exception:
        return jsonify({'success': False})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
