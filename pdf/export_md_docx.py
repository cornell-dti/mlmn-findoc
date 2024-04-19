import json
import os
import pypandoc

class ConvertJson():
    def __init__(self, json_fp):
        self.fp = json_fp
        self.jdata = self.get_json()
        self.mddata = self.format_json_to_md()

    def get_json(self):
        with open(self.fp) as f:
            res = json.load(f)
        return res

    def format_json_to_md(self, data=None, level=2):
        text = ''
        if data is None:
            data = self.jdata

        if isinstance(data, dict):
            for header, content in data.items():
                header = header.replace("_", " ")
                if isinstance(content, dict):
                    text += f'{"#" * level} {header[0].upper() + header[1:]}\n'
                    text += self.format_json_to_md(content, level + 1)
                elif isinstance(content, list):
                    text += f'{"#" * level} {header[0].upper() + header[1:]}\n'
                    for item in content:
                        text += self.format_json_to_md(item, level + 1)
                else:
                    text += f' **{header[0].upper() + header[1:]}**: {str(content)[0].upper() + str(content)[1:]}\n\n'
        else:
            text += str(data) + '\n\n'

        return text

    def convert_dict_to_md(self, output_fn):
        with open("md_output/"+output_fn, 'w') as writer:
            writer.writelines(self.mddata)
        print('Dict successfully converted to md')

    def convert_md_to_docx(self, output_fn):
        output = pypandoc.convert_text(self.mddata, 'docx', format='md', outputfile="docx_output/"+output_fn)
        print('Md successfully converted to docx')


# Get all json files and export them to PDFs
directory = "../pdf/json_output"
json_files = os.listdir(directory)
for file in json_files:
    converter = ConvertJson(directory+"/"+file)
    converter.convert_dict_to_md(file[:-5]+'.md')
    converter.convert_md_to_docx(file[:-5]+'.docx')
