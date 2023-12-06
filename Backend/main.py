from werkzeug.utils import secure_filename
from flask import Flask, request
import tensorflow as tf
import numpy as np
import os
import cv2
from PIL import Image
from flask import jsonify

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Load the Model
model = tf.keras.models.load_model('best_model.h5')

input_size = (64, 64)

@app.route('/predict', methods=['POST'])
def predict():

    image = request.files['image']
    name  = save_file(image)

    image_path = os.path.join(app.config['UPLOAD_FOLDER'], name)

    img = cv2.imread(image_path)
    img = Image.fromarray(img)
    img = img.resize(input_size)
    img = np.array(img)
    input_img = np.expand_dims(img, axis=0)
    res = model.predict(input_img)
    if res:
        result = 'Tumor Detected'
    else:
      result = 'No Tumor'

    data = {'image_path': image_path,
            'predict': result}
    return returnAPI(200, 'Success', data)

def save_file(image):
    name = secure_filename(image.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], name)

    try:
        os.remove(path)
    except OSError:
        pass
        
    image.save(path)
    return name

def returnAPI(code=200, message='', data=[]):
    status = 'success'
    if code != 200:
        status = 'failed'
    returnArray = {
        'code': code,
        'status': status,
        'message': message,
        'data': data
    }
    return jsonify(returnArray)

if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5290)