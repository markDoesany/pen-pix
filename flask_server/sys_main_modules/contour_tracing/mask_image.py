import json
import cv2 as cv
import os

def load_predictions(data_src):
    """Load predictions from a JSON file."""
    with open(data_src) as file:
        data = json.load(file)
    return data

def mask(image_src, data):
    """Draw rectangles on the image based on the provided data."""
    image = cv.imread(image_src)
    if image is None:
        raise FileNotFoundError(f"Image file {image_src} not found.")
    
    image_copy = image.copy()
    for value in data:
        top_left = (value['x'], value['y'])
        bottom_right = (value['x'] + value['width'], value['y'] + value['height'])
        # cv.rectangle(image_copy, top_left, bottom_right, value['color'], -1)
        cv.rectangle(image_copy, top_left, bottom_right, (255,255,255), -1)

        # Uncomment this line if you want to add text
        # cv.putText(image_copy, value['id'], (value['x'] + value['width']//3, value['y'] + value['height']//2), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
    
    return image_copy

def mask_images(source_folder, output_folder, annotation_folder):
    """Process images in the specified folder and save the results with annotations."""
    # Ensure the output directory exists
    os.makedirs(output_folder, exist_ok=True)
    image_extensions = ['.jpg', '.jpeg', '.png']
    
    for filename in os.listdir(source_folder):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            full_path = os.path.join(source_folder, filename)
            
            json_file = os.path.join(annotation_folder, f"{filename}.json")
            
            if os.path.exists(json_file):
                data = load_predictions(json_file)
                annotated_image = mask(full_path, data)
                
                output_path = os.path.join(output_folder, f"{filename}")
                cv.imwrite(output_path, annotated_image)

            else:
                print(f"Annotation file {json_file} does not exist.")


def mask_image(source_file, output_folder, json_file):
    """Process a single image file with its annotation and save the result."""
    # Ensure the output directory exists
    os.makedirs(output_folder, exist_ok=True)
    
    # Extract filename and its extension
    filename = os.path.basename(source_file)
    
    # Prepare paths
    output_path = os.path.join(output_folder, filename)
    
    # Check if the JSON annotation file exists
    data = load_predictions(json_file)
    annotated_image = mask(source_file, data)
    
    # Save the processed image
    cv.imwrite(output_path, annotated_image)
    print(f"Saved annotated image to {output_path}")
    
