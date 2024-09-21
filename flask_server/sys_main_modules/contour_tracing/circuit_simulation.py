import re

def write_boolean_expression_to_verilog(expression_dict, filename):
    def extract_inputs(expression):
        """Extracts input variables from a boolean expression."""
        return set(re.findall(r'X\d+', expression))

    inputs = set()
    outputs = set()
    for output_name, expr in expression_dict.items():
        outputs.add(output_name)
        inputs.update(extract_inputs(expr))

    with open(filename, 'w') as file:
        # Module header
        file.write('module boolean_circuit (\n')
        file.write('  input wire ')
        file.write(', '.join(sorted(inputs)))
        file.write(',\n')

        file.write('  output wire ')
        file.write(', '.join(sorted(outputs)))
        file.write('\n);\n\n')

        # Write Boolean expressions
        for output_name, expr in expression_dict.items():
            formatted_expr = expr.replace(' ^ ', ' ^ ').replace(' & ', ' & ').replace(' | ', ' | ')
            file.write(f'  // Output {output_name}: {formatted_expr}\n')
            file.write(f'  assign {output_name} = {formatted_expr};\n\n')

        # Module end
        file.write('endmodule\n')

