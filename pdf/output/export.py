import os
import json

json_directory = os.path.dirname(__file__)
txt_output_directory = os.path.dirname(json_directory) + "/txt_outputs"

for filename in os.listdir(json_directory):
  json_path = os.path.join(json_directory, filename)
  txt_path = os.path.join(txt_output_directory, os.path.splitext(filename)[0] + '.txt')
        
  try:
    with open(json_path, 'r') as json_file:
      data = json.load(json_file)
  except json.JSONDecodeError as e:
      continue 
        
  with open(txt_path, 'w') as txt_file:
    txt_file.write(json.dumps(data, indent=4))

print("🚀" + "completed converting json files to txt files" + "🚀")
