import json
import os
from pdfdocument.document import PDFDocument

def extract_values(obj, values, indent_level):
    if isinstance(obj, dict):
        for key, value in obj.items():
            if isinstance(value, (int, float, str)):
                values.append(f"{' ' * indent_level}{key}: {value}")
            else:
                values.append(f"{' ' * indent_level}{key}:")
                extract_values(value, values, indent_level + 1)
    elif isinstance(obj, list):
        for item in obj:
            extract_values(item, values, indent_level)
    else:
        values.append(f"{' ' * indent_level}{obj}")


def get_values(json_data, indent_level=0):
    values = []
    extract_values(json_data, values, indent_level)
    return values


def prepending_spaces(s):
    count = 0
    for char in s:
        if char == ' ':
            count += 1
        else:
            break
    return count


def json_to_pdf(json_file, output_path):
    pdf = PDFDocument(output_path)
    pdf.init_report()

    # Get json data
    with open('json_output/'+json_file, 'r') as file:
        data = json.load(file)
    
    # Save data as strings (nested data have spaces prepended to indicate
    # they need indentation)
    json_values = get_values(data)
    
    # Write the values to the PDF document, indenting where appropriate
    for value in json_values:
        if prepending_spaces(value) > 0:
            # TODO: indent multiple times based on number of prepending spaces
            pdf.p(value, style=pdf.style.indented)
        else:
            pdf.p(value)
    
    pdf.generate()


# Get all json files and export them to PDFs
directory = "../pdf/json_output"
json_files = os.listdir(directory)
for file in json_files:
    json_to_pdf(file, "pdf_output/"+file[:-5]+".pdf")