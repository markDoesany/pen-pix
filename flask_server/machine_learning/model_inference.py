import numpy as np
import model_detection
import json
import os

image_extensions = ['.jpg', '.jpeg', '.png']
os.makedirs('./annotation_data', exist_ok=True)
weights = './weight/the_very_best.pt'

def infer_images(source_folder, data_output_folder):
    for filename in os.listdir(source_folder):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            source = os.path.join(source_folder, filename)
            img_size = 640 
            data = model_detection.detect(source=source, weights=weights, img_size=img_size, 
                        save_img=False, view_img = False, save_txt = False, no_trace=True) #false if new weight

            with open(f'{data_output_folder}{filename}.json', 'w') as f:
                    json.dump(data, f)


def infer_image(source_file, data_output_folder):
    
    if not os.path.exists(data_output_folder):
        os.makedirs(data_output_folder)

    filename = os.path.basename(source_file)
    output_file = os.path.join(data_output_folder, f"{filename}.json")

    img_size = 640
    data = model_detection.detect(source=source_file, weights=weights, img_size=img_size,
                                  save_img=False, view_img=False, save_txt=False, no_trace=True)

    with open(output_file, 'w') as f:
        json.dump(data, f)