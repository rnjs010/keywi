from dbctl import DBs
from pprint import pprint
from base import StoreData
from driver import init_driver
from product_crawler import crawler
from mj import make_json, open_json


if __name__ == "__main__":
    while True:
        try:
            KeyWi=DBs()
            if KeyWi:break
        except:
            print("다시 시도해주세요.")
    Data=StoreData()
    KeyWi.check_table('products')
    KeyWi.check_table('products_descriptions')
    
    if input('1. crawling  2. insertDB (1): ')=='2':
        products=open_json('swegkey_product')
        for value in products.values():
            category_id, product_name, price, product_url, product_image, options = value
            if KeyWi.exist_product(product_name):
                print(f"\n{product_name} 존재.\n")
                continue
            KeyWi.insert_product(*value)
        print('swegkey 데이터 삽입 완료')
        products=open_json('geon_product')
        for value in products.values():
            category_id, product_name, price, product_url, product_image, options = value
            if KeyWi.exist_product(product_name):
                print(f"\n{product_name} 존재.\n")
                continue
            KeyWi.insert_product(*value)
        print("geon 데이터 삽입 완료.")
    else:
        driver, wait=init_driver()
        
        swegkey="/swagkey"
        geonworks="/geonlab"
        
        
        swegkey_product={}
        swegkey_product, product_id=crawler(driver, wait, swegkey, Data.swegkey_list, Data.swegkey_dic, Data, KeyWi)
        # products=KeyWi.select_product(end=470)
        # for key, *value in products: swegkey_product[key]=value
        # pprint(swegkey_product)
        # make_json('swegkey_product', swegkey_product)
        
        geon_product={}
        geon_product, product_id=crawler(driver, wait, geonworks, Data.geon_list, Data.geon_dic, Data, KeyWi)
        # products=KeyWi.select_product(start=471)
        # for key, *value in products:geon_product[key]=value
        # pprint(geon_product)
        # make_json('geon_product', geon_product)
        
        driver.quit()