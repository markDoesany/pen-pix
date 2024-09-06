import cv2
import numpy as np
import os

def draw_contour(img):
    contours, _ = cv2.findContours(img, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    filtered_contours = [contour for contour in contours if cv2.contourArea(contour) > 200]

    contour_img = np.zeros_like(img)
    cv2.drawContours(contour_img, filtered_contours, -1, (255, 255, 255), thickness=cv2.FILLED)

    return contour_img

def process_image(source_folder, output_folder, filename):
    full_path = os.path.join(source_folder, filename)

    img = cv2.imread(full_path, cv2.IMREAD_GRAYSCALE)
    _, thresh = cv2.threshold(img, 125, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilate = cv2.dilate(thresh, kernel, iterations=2)
    erode  = cv2.erode(dilate, kernel, iterations=2)
    
    contour_img = draw_contour(erode)

    output_path = os.path.join(output_folder, filename)
    cv2.imwrite(output_path, contour_img)

def binarize_images(source_folder, output_folder):
    os.makedirs(output_folder, exist_ok=True)
    image_extensions = ['.jpg', '.jpeg', '.png']
    
    for filename in os.listdir(source_folder):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            process_image(source_folder, output_folder, filename)
            

def binarize_image(source_file, output_folder):
    filename = os.path.basename(source_file)
    os.makedirs(output_folder, exist_ok=True)
    img = cv2.imread(source_file, cv2.IMREAD_GRAYSCALE)
    _, thresh = cv2.threshold(img, 125, 255, cv2.THRESH_BINARY_INV)
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilate = cv2.dilate(thresh, kernel, iterations=2)
    erode = cv2.erode(dilate, kernel, iterations=2)
    
    
    # Draw contours
    contour_img = draw_contour(erode)
    
    output_path = os.path.join(output_folder, filename)
    cv2.imwrite(output_path, contour_img)
