import json
from pprint import pprint
from base import StoreData
from driver import init_driver
from product_crawler import crawler


def make_json(filename, data):
    with open(f"{filename}.json", "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)
    
    print(f"{filename} JSON 파일이 성공적으로 저장되었습니다!")


if __name__ == "__main__":
    Data=StoreData()
    driver, wait=init_driver()
    
    swegkey="/swagkey"
    geonworks="/geonlab"
    
    product_id=0
    
    swegkey_product={}
    swegkey_product, product_id=crawler(driver, wait, product_id, swegkey, Data.swegkeyList, Data.swegkeyDic, Data)
    # products=KeyWi.select_product(end=470)
    # for key, *value in products: swegkey_product[key]=value
    pprint(swegkey_product)
    make_json('swegkey_product', swegkey_product)
    
    geon_product={}
    geon_product, product_id=crawler(driver, wait, product_id, geonworks, Data.geonList, Data.geonDic, Data)
    # products=KeyWi.select_product(start=471)
    # for key, *value in products:geon_product[key]=value
    pprint(geon_product)
    make_json('geon_product', geon_product)
    
    driver.quit()