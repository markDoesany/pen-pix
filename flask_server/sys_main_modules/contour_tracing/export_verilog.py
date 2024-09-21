import re

def export_to_verilog(expression_dict):
    def extract_inputs(expression):
        """Extracts input variables from a boolean expression."""
        return set(re.findall(r'X\d+', expression))

    inputs = set()
    outputs = set()
    for output_name, expr in expression_dict.items():
        outputs.add(output_name)
        inputs.update(extract_inputs(expr))

    verilog_content = []

    verilog_content.append('module boolean_circuit (\n')
    verilog_content.append('  input wire ')
    verilog_content.append(', '.join(sorted(inputs)))
    verilog_content.append(',\n')

    verilog_content.append('  output wire ')
    verilog_content.append(', '.join(sorted(outputs)))
    verilog_content.append('\n);\n\n')

    for output_name, expr in expression_dict.items():
        formatted_expr = expr.replace(' ^ ', ' ^ ').replace(' & ', ' & ').replace(' | ', ' | ')
        verilog_content.append(f'  // Output {output_name}: {formatted_expr}\n')
        verilog_content.append(f'  assign {output_name} = {formatted_expr};\n\n')

    verilog_content.append('endmodule\n')
    return ''.join(verilog_content)
