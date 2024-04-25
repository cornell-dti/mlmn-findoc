import os
import json

json_dir= os.path.dirname(__file__) + "/json_output"
txt_output_dir = os.path.dirname(json_dir) + "/txt_output"

for file_name in os.listdir(json_dir):
  json_path = os.path.join(json_dir, file_name)
  txt_path = os.path.join(txt_output_dir, os.path.splitext(file_name)[0] + '.txt')

  try:
    with open(json_path, 'r') as json_file:
      data = json.load(json_file)
  except json.JSONDecodeError as e:
      continue 

  cleaned_info = json.dumps(data, indent=4, ensure_ascii=False).replace('{', '').replace('}', '').replace('[', '').replace(']', '').replace('"', '').replace(',', '').replace("_", ' ' )
  
  with open(txt_path, 'w') as txt_file:
        txt_file.write(cleaned_info)
   
  with open(txt_path) as reader, open(txt_path, 'r+') as writer:
    for l in reader:
      if l.strip():
        writer.write(l)
    writer.truncate()
 


