import threading, json
from dbctl import DBs
from time import sleep
from pprint import pprint
from driver import init_driver
from mj import make_json, open_json
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from pynput.keyboard import Key, Controller, Listener
from selenium.webdriver.support import expected_conditions as EC

keyboard = Controller()
exit_flag = False

def on_press(key):
    global exit_flag
    if key == Key.esc:
        print("\nESC 키가 눌렸습니다. 프로그램을 종료합니다.")
        exit_flag = True
        return False

def listen_for_esc():
    with Listener(on_press=on_press) as listener:
        listener.join()

    with Listener(on_press=on_press) as listener:
        listener.join()

def strToDict(data):
    try:
        parsed_data = json.loads(data)
        return parsed_data
    except json.JSONDecodeError as e:
        print(f"JSON 파싱 오류: {e}")

if __name__ == '__main__':
    esc_listener_thread = threading.Thread(target=listen_for_esc, daemon=True)
    esc_listener_thread.start()
    # while True:
    #     try:
    #         KeyWi=DBs()
    #         if KeyWi:break
    #     except:
    #         print("다시 시도해주세요.")
    # products = KeyWi.select_product(800,800)
    
    products = open_json()
    
    fail_products={}
    result=[]
    # for products_id, *value in products:
    for products_id, value in products.items():
        if exit_flag: break
        try:
            driver, wait = init_driver()
            category_id, product_name, price, product_url, product_image, options = value["value"]
            driver.get(product_url)
            act=ActionChains(driver)
            
            # 상품상세 로딩 시키기 위함
            body=driver.find_element(By.TAG_NAME, 'body')
            body.send_keys(Keys.END)
            
            driver.implicitly_wait(5)
            sleep(1)
            
            try:
                body.send_keys(Keys.END)
                sleep(1)
                moredetail=wait.until(EC.element_to_be_clickable((By.CLASS_NAME, '_1gG8JHE9Zc')))
                if moredetail.text=='상세정보 펼쳐보기':
                    act.move_to_element(moredetail).perform()
                    sleep(0.5)
                    act.click(moredetail).perform()
            except Exception as e:
                print(e)
                print("상세 보기 실패")
            
            productdetails = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, '_9F9CWn02VE')))
            
            components = productdetails.find_elements(By.CLASS_NAME, 'se-component')
            
            description_list=[]
            for component in components:
                compclass=component.get_attribute("class")
                
                if "se-text " in compclass:
                    descriptions=component.find_elements(By.TAG_NAME, "p")
                    des=''
                    for de in descriptions:
                        des=des+de.text+'\n'
                    if len(des)<480:
                        description_list.append([products_id, des, len(description_list)+1, 'text'])
                    
                    for de in descriptions:
                        description_list.append([products_id, de.text, len(description_list)+1, 'text'])
                
                elif "se-imageStrip " in compclass:
                    try:
                        gifs = component.find_elements(By.TAG_NAME, "video")
                        gifURLs=''
                        for gif in gifs:
                            gifURL=gif.get_attribute("data-src")
                            gifURLs+=(gifURL+'\n')
                        description_list.append([products_id, gifURLs, len(description_list)+1, 'gif'])
                    except Exception as e: print(e)
                
                elif "se-image " in compclass:
                    imgURL=component.find_element(By.TAG_NAME, "img").get_attribute("data-src")
                    hyperlink=None
                    imgdata=strToDict(component.find_element(By.TAG_NAME, "a").get_attribute("data-linkdata"))
                    if imgdata["linkUse"]=="true":hyperlink=imgdata["link"]
                    description_list.append([products_id, imgURL, len(description_list)+1, 'image', hyperlink])
                    
                    img_descriptions=component.find_elements(By.TAG_NAME, "p")
                    if img_descriptions:
                        for imde in img_descriptions:
                            description_list.append([products_id, imde.text, len(description_list)+1, 'text'])
                
                elif "se-horizontalLine " in compclass:
                    if "se-l-line1" in compclass:
                        description_list.append([products_id, 'long', len(description_list)+1, 'hr'])
                    elif "se-l-default"  in compclass:
                        description_list.append([products_id, 'short', len(description_list)+1, 'hr'])
                
                elif "se-oembed " in compclass:
                    embedURL=component.find_element(By.TAG_NAME, "iframe").get_attribute("src")
                    description_list.append([products_id, embedURL, len(description_list)+1, 'embed'])
        
        
            # for description in description_list:
            #     KeyWi.insert_product_description(*description)
            print(product_name)
            pprint(description_list)
            print()
            driver.quit()
        except Exception as e:
            print(products_id, len(description_list)+1)
            print(e)
            # fail_products[products_id]={"value":value,"error_type": e.__class__.__name__, "error_message":str(e), "location":(len(description_list)+1)}
            fail_products[products_id]={"value":value["value"],"error_type": e.__class__.__name__, "error_message":str(e), "location":(len(description_list)+1)}
            driver.quit()
        else:
            result=result+description_list
        finally:description_list=[]
    if result:
        try:make_json('products_descriptions', result)
        except Exception as e:print(e)
    if fail_products:
        try:make_json('fail_products', fail_products)
        except Exception as e:print(e)