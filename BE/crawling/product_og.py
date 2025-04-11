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

def og_crawling(KeyWi, driver, act, wait, product_id, product_name):
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
    
    des_ids=KeyWi.get_link_description_ids(product_id)
    print(des_ids)
    
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
    
    links = productdetails.find_elements(By.CLASS_NAME, 'se-oglink')
    
    for i, link in enumerate(links):
        lasttab=driver.current_window_handle
        try:
            act.move_to_element(link).perform()
            
            hy=link.find_element(By.TAG_NAME, 'a').get_attribute("href")
            cli=link.find_element(By.CLASS_NAME, 'se-oglink-info')
            sleep(0.5)
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", cli)
            sleep(0.5)
            cli.send_keys(Keys.ENTER)
            
            sleep(1)
            driver.switch_to.window(driver.window_handles[-1])
            driver.implicitly_wait(5)
            sleep(5)
            cu=driver.current_url
            # if "notion" in cu or cu.strip()!=hy.strip():continue
            print(cu, "링크 조회 중")
            
            body=driver.find_element(By.TAG_NAME, 'body')
            
            driver.execute_script("""
                var event = new WheelEvent('wheel', {deltaY: 120});
                arguments[0].dispatchEvent(event);
            """, body)
            
            body.send_keys(Keys.END)
            driver.execute_script("""
                var event = new WheelEvent('wheel', {deltaY: -130});
                arguments[0].dispatchEvent(event);
            """, body)
            driver.implicitly_wait(5)
            sleep(2)
            
            meta_tags = driver.find_elements(By.TAG_NAME, 'meta')
            og_data = {}

            for tag in meta_tags:
                prop = tag.get_attribute('property') or tag.get_attribute('name')
                content = tag.get_attribute('content')

                if prop and prop.startswith('og:'):
                    og_data[prop] = content
            
            og_json_string = json.dumps(og_data, ensure_ascii=False)
            
            
            inde = des_ids[i]
            print(og_json_string, "+++",hy,"+++",inde)
            KeyWi.update_link(og_json_string, hy, inde)
            
            driver.close()
        except Exception as e:
            print(e)
            print(des_ids[i], "번 갱신 실패")
        driver.switch_to.window(lasttab)
        
    print(product_name)
    print()
    sleep(2)
    driver.close()