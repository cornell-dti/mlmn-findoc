import json
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def get_indented_style(style, indent_level, additional_indent=0):
    left_indent = (indent_level * 12) + additional_indent
    return ParagraphStyle(
        f'IndentedStyle{indent_level}_{additional_indent}', 
        parent=style, 
        firstLineIndent=0,
        leftIndent=left_indent,
        spaceBefore=0,
        spaceAfter=0,
    )

def extract_values(obj, text, style, indent_level=0):
    if isinstance(obj, dict):
        for index, (key, value) in enumerate(obj.items()):
            key_str = f"<b>{key}:</b>"
            additional_indent = 4 if index == 1 else 0
            current_style = get_indented_style(style, indent_level, additional_indent=additional_indent)
            if isinstance(value, (dict, list)):
                text.append(Paragraph(key_str, current_style))
                extract_values(value, text, style, indent_level + 1)
            else:
                text.append(Paragraph(f"{key_str} {value}", current_style))
    elif isinstance(obj, list):
        for item in obj:
            if isinstance(item, (dict, list)):
                extract_values(item, text, style, indent_level)
            else:
                current_style = get_indented_style(style, indent_level)
                text.append(Paragraph(str(item), current_style))
    else:
        current_style = get_indented_style(style, indent_level)
        text.append(Paragraph(str(obj), current_style))

styles = getSampleStyleSheet()
preformatted_style = ParagraphStyle(
    'Preformatted', 
    parent=styles['Code'], 
    fontName='Times-Roman',
    fontSize=10,
    leading=12
)

def json_to_pdf(json_file, output_path):
    #Load JSON data
    with open('json_output/'+json_file, 'r') as file:
        json_data = json.load(file)

    #Create SimpleDocTemplate object with given output path and page size
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    text = []

    #Build pdf page with content from the JSON data
    extract_values(json_data, text, preformatted_style)
    doc.build(text)

# Get all json files and export them to PDFs
directory = "../pdf/json_output"
json_files = os.listdir(directory)
for file in json_files:
    json_to_pdf(file, "pdf_output/"+file[:-5]+".pdf")