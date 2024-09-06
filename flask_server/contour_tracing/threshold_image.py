import os
import cv2

def apply_threshold_to_images(source_folder, output_folder, threshold_value=100):
    image_extensions = ['.jpg', '.jpeg', '.png']
    for filename in os.listdir(source_folder):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            full_path = os.path.join(source_folder, filename)
            img = cv2.imread(full_path, cv2.COLOR_BGR2GRAY)
            _, thresholded_image = cv2.threshold(img, threshold_value, 255, cv2.THRESH_BINARY)
            cv2.imwrite(f'{output_folder}{filename}', thresholded_image)


def apply_threshold_to_image(source_file, output_folder, threshold_value=100):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    filename = os.path.basename(source_file)
    output_file = os.path.join(output_folder, filename)

    img = cv2.imread(source_file, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        print(f"Error loading image: {source_file}")
        return
    # 125
    _, thresholded_image = cv2.threshold(img, threshold_value, 255, cv2.THRESH_BINARY)
    
    cv2.imwrite(output_file, thresholded_image)