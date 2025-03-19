import json

def make_json(filename, data):
    with open(f"{filename}.json", "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)
    
    print(f"{filename} JSON 파일이 성공적으로 저장되었습니다!")