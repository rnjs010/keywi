import json, traceback
from time import sleep
from pprint import pprint
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC

def strToDict(data):
    try:
        parsed_data = json.loads(data)
        return parsed_data
    except json.JSONDecodeError as e:
        print(f"JSON 파싱 오류: {e}")

def detail_crawling(KeyWi, driver, act, wait, product_id, product_name):
    body=driver.find_element(By.TAG_NAME, 'body')
    driver.execute_script("""
        var event = new WheelEvent('wheel', {deltaY: 120});
        arguments[0].dispatchEvent(event);
    """, body)
    name=driver.find_element(By.CLASS_NAME, '_22kNQuEXmb').text
    body.send_keys(Keys.END)
    driver.execute_script("""
        var event = new WheelEvent('wheel', {deltaY: -130});
        arguments[0].dispatchEvent(event);
    """, body)
    driver.implicitly_wait(5)
    sleep(1)
    
    if name.strip()!=product_name.strip():return False
    
    try:
        body.send_keys(Keys.END)
        sleep(3)
        moredetail=wait.until(EC.element_to_be_clickable((By.CLASS_NAME, '_1gG8JHE9Zc')))
        if moredetail.text=='상세정보 펼쳐보기':
            act.move_to_element(moredetail).perform()
            sleep(0.5)
            act.click(moredetail).perform()
    
    except Exception as e:
        print(e)
        print("상세 보기 실패")
        try: 
            body.send_keys(Keys.F5)
            sleep(1)
            driver.execute_script("""
                var event = new WheelEvent('wheel', {deltaY: 120});
                arguments[0].dispatchEvent(event);
            """, body)
            body.send_keys(Keys.END)
            sleep(3)
            driver.execute_script("""
                var event = new WheelEvent('wheel', {deltaY: -110});
                arguments[0].dispatchEvent(event);
            """, body)
            sleep(1)
            moredetail=wait.until(EC.element_to_be_clickable((By.CLASS_NAME, '_1gG8JHE9Zc')))
            if moredetail.text=='상세정보 펼쳐보기':
                act.move_to_element(moredetail).perform()
                sleep(0.5)
                act.click(moredetail).perform()
        except Exception as e:
            print(e) 
            traceback.print_exc()
            print("로딩 실패")
        else: print("이 상품은 현재 판매중지 된 상품입니다.")
    
    
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
            # if len(des)<480:
            description_list.append([product_id, des, len(description_list)+1, 'text'])
            
            # for de in descriptions:
            #     description_list.append([product_id, de.text, len(description_list)+1, 'text'])
        
        elif "se-imageStrip " in compclass:
            try:
                gifs = component.find_elements(By.TAG_NAME, "video")
                gifURLs=''
                for gif in gifs:
                    gifURL=gif.get_attribute("data-src")
                    gifURLs+=(gifURL+'\n')
                description_list.append([product_id, gifURLs, len(description_list)+1, 'gif'])
            except Exception as e: print(e)
        
        elif "se-image " in compclass:
            imgURL=component.find_element(By.TAG_NAME, "img").get_attribute("data-src")
            hyperlink=None
            imgdata=strToDict(component.find_element(By.TAG_NAME, "a").get_attribute("data-linkdata"))
            if imgdata["linkUse"]=="true":hyperlink=imgdata["link"]
            description_list.append([product_id, imgURL, len(description_list)+1, 'image', hyperlink])
            
            img_descriptions=component.find_elements(By.TAG_NAME, "p")
            if img_descriptions:
                for imde in img_descriptions:
                    description_list.append([product_id, imde.text, len(description_list)+1, 'text'])
        
        elif "se-horizontalLine " in compclass:
            if "se-l-line1" in compclass:
                description_list.append([product_id, 'long', len(description_list)+1, 'hr'])
            elif "se-l-default"  in compclass:
                description_list.append([product_id, 'short', len(description_list)+1, 'hr'])
        
        elif "se-oembed " in compclass:
            embedURL=component.find_element(By.TAG_NAME, "iframe").get_attribute("src")
            description_list.append([product_id, embedURL, len(description_list)+1, 'embed'])
        
        elif "se-oglink " in compclass:
            link=component.find_element(By.TAG_NAME, "a").get_attribute("href")
            description_list.append([product_id, link, len(description_list)+1, 'link'])

    for description in description_list:
        KeyWi.insert_product_description(*description)
    print(product_name)
    pprint(description_list)
    description_list=[]
    print()
    sleep(2)
    driver.close()