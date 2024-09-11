import numpy as np
from . import model_detection
import cv2
import tempfile
import sys

sys.path.insert(0, './sys_main_modules')
weights = './sys_main_modules/weight/best.pt'

def infer_image(image_bytes):
    try:
        img_array = np.frombuffer(image_bytes.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)
        
        if img is None:
            return {"error": "Invalid image data"}

        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
            temp_filepath = temp_file.name
            cv2.imwrite(temp_filepath, img) 

        img_size = 640
        data = model_detection.detect(source=temp_filepath, weights=weights, img_size=img_size,
                                      save_img=False, view_img=False, save_txt=False, no_trace=False)
        if not data:
            return {"error": "No objects detected in the image"}

        return data

    except Exception as e:
        return {"error": str(e)}
