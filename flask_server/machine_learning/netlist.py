import cv2 as cv
import copy
import json
import contour_tracing
import boolean_function
import os

def load_json_file(file_path):
    """Load a JSON file and return its contents."""
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: The file {file_path} is not a valid JSON.")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def get_class_count(json_data, classname):
    # Count the number of elements with the class 'input'
    count = sum(1 for item in json_data if item.get('class') == classname)
    
    return count

def print_consolidated_truth_table(boolean_functions, input_count):
    """Print a consolidated truth table for all boolean functions."""
    # Extract labels and expressions
    labels = []
    expressions = []

    for key, value in boolean_functions.items():
        labels.append(key)
        expressions.append(boolean_function.convert_to_sympy_expression(value, input_count))

    # Generate truth tables
    truth_tables = []
    for expr in expressions:
        table = boolean_function.generate_truth_table(expr, input_count)
        truth_tables.append(table)

    # Print consolidated truth table
    header = ' '.join([f'X{i+1}' for i in range(input_count)]) + ' | ' + ' | '.join(labels)
    print(header)
    print('-' * len(header))

    # Assuming all tables have the same length
    rows = len(truth_tables[0])
    for i in range(rows):
        row_values = []
        for table in truth_tables:
            row_values.append(str(table[i][-1]))
        print(' '.join(map(str, truth_tables[0][i][:-1])) + ' | ' + ' | '.join(row_values))
    

def analyze_circuit(image_path, prediction_path):
    image = cv.imread(image_path)
    data = load_json_file(prediction_path)

    if image is None:
            raise FileNotFoundError(f"Image file {image_path} not found.")

    if data is None:
            raise FileNotFoundError(f"Image file {prediction_path} not found.")

    image_copy = image.copy()
    data_copy = copy.deepcopy(data)

    # Get all points necessary to trace contours
    stop_points = contour_tracing.get_endpoints(image_copy, data_copy)
    start_points = contour_tracing.get_startpoints(image_copy, data_copy)
    junction_points  = contour_tracing.get_junction_points(image_copy, data_copy)
    intersection_points = contour_tracing.get_intersection_points(image_copy, data_copy)

    # Proceed to trace the contours using the points
    line_boundary, connections = contour_tracing.line_boundary_tracing(image_copy, start_points, stop_points, intersection_points, junction_points)

    # Draw the end-to-end line points to the connected pins
    # for connection in connections:
    #     start = connection['connected_points'][0]
    #     end = connection['connected_points'][1]
    #     cv.line(image_copy, start, end, (0,0,255), 2)

    for point in line_boundary:
        cv.circle(image_copy, point, 1, (0, 0, 255), -1)
    
    # Get the boolean function and display truth table
    boolean_functions = contour_tracing.get_boolean_function(connections)
    input_count = get_class_count(data_copy, 'input')

    # Translate the boolean expression to a verilog file
    # circuit_simulation.write_boolean_expression_to_verilog(boolean_functions, './verilog/boolean_circuit.v')
    # cv.imshow("image",image_copy)
    filename = os.path.basename(image_path)
    output_path = os.path.join("./images/connection_images/", filename)
    cv.imwrite(output_path, image_copy)

    # cv.waitKey(0)
    # cv.destroyAllWindows()
    
    return boolean_functions, input_count

# image_path = './images/masked_images/sample_02.png'
# prediction_path = "./annotation_data/sample_02.png.json"
# analyze_circuit(image_path, prediction_path)
