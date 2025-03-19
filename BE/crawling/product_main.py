from dbctl import DBs
from mj import make_json
from pprint import pprint
from base import StoreData
from driver import init_driver
from product_crawler import crawler


if __name__ == "__main__":
    while True:
        try:
            KeyWi=DBs()
            if KeyWi:break
        except:
            print("다시 시도해주세요.")
    Data=StoreData()
    driver, wait=init_driver()
    
    swegkey="/swagkey"
    geonworks="/geonlab"
    
    product_id=0
    
    swegkey_product={}
    swegkey_product, product_id=crawler(driver, wait, product_id, swegkey, Data.swegkey_list, Data.swegkey_dic, Data, KeyWi)
    # products=KeyWi.select_product(end=470)
    # for key, *value in products: swegkey_product[key]=value
    pprint(swegkey_product)
    make_json('swegkey_product', swegkey_product)
    
    geon_product={}
    geon_product, product_id=crawler(driver, wait, product_id, geonworks, Data.geon_list, Data.geon_dic, Data, KeyWi)
    # products=KeyWi.select_product(start=471)
    # for key, *value in products:geon_product[key]=value
    pprint(geon_product)
    make_json('geon_product', geon_product)
    
    driver.quit()