from time import sleep
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC


def show_product(KeyWi):
    for p in KeyWi.select_product():
        print(p)


def today(wait):
    try:
        today_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[contains(text(),'오늘하루 안보기')]")))
        sleep(0.5)
        today_button.click()
    except:
        print("팝업 없음")


def crawler(driver, wait, product_id, URL, List, Dic, Data, KeyWi):
    baseURL="https://smartstore.naver.com"
    query="?st=RECENT&dt=IMAGE&page=1&size=80"
    driver.get(baseURL+URL)
    driver.implicitly_wait(5)
    act=ActionChains(driver)
    
    # 탭 목록 저장용
    tab={}
    driver.execute_script(f'window.open("{driver.current_url}");')
    driver.switch_to.window(driver.window_handles[-1])
    tab[0]=driver.current_window_handle
    today(wait)
    
    for l in List:
        menu = wait.until(EC.element_to_be_clickable((By.ID,"pc-categoryMenuWidget")))
        
        # 메뉴 더보기 버튼 누르기
        try:
            more_button=menu.find_element(By.XPATH, f"//button[text()='더보기']") #By.CLASS_NAME, "_3ryPAjhmjZ")
            more_button.click()
            sleep(0.5)
        except:print(f"{l} 이미 열림")
        
        sub=menu.find_element(By.XPATH, f"//a[text()='{l}']")
        act.move_to_element(sub).perform()
        sub_menu=wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "T20614P231")))
        sleep(1)
        
        if Dic[l]:
            # 마우스 호버해서 얻은 세부 카테고리
            for detail, cid in Dic[l]:
                d=sub_menu.find_element(By.XPATH, f"//a[text()='{detail}']")
                detail_page=d.get_attribute('href').replace("?cp=1", query)
                print(detail, detail_page)
                driver.execute_script(f'window.open("{detail_page}");')
                driver.switch_to.window(driver.window_handles[-1])
                if cid in tab:
                    tab[cid]+=[driver.current_window_handle]
                else:tab[cid]=[driver.current_window_handle]
                driver.switch_to.window(tab[0])
        else:
            # 만약 조회할 세부 디렉토리가 없는 경우
            subpage=sub.get_attribute('href').replace("?cp=1", query)
            print(l, subpage)
            driver.execute_script(f'window.open("{subpage}");')
            driver.switch_to.window(driver.window_handles[-1])
            if Data.geon_category[l] in tab:
                tab[Data.geon_category[l]]+=[driver.current_window_handle]
            else: tab[Data.geon_category[l]]=[driver.current_window_handle]
            driver.switch_to.window(tab[0])
    
    product_list={}
    
    for cid, pages in tab.items():
        if cid==0:continue
        for page in pages:
            driver.switch_to.window(page)
            sleep(1)
            driver.implicitly_wait(5)
            
            body=driver.find_element(By.TAG_NAME, 'body')
            body.send_keys(Keys.END)
            sleep(1)
            
            pagenation=body.find_element(By.CLASS_NAME, "_2UJrM31-Ry")
            pagenum=len(pagenation.find_elements(By.CLASS_NAME, "UWN4IvaQza"))
            
            for i in range(1, pagenum+1):
                body=driver.find_element(By.TAG_NAME, 'body')
                body.send_keys(Keys.END)
                pagenation=body.find_element(By.CLASS_NAME, "_2UJrM31-Ry")
                page_button=pagenation.find_element(By.XPATH,f"//a[text()='{i}']")
                page_button.click()
                driver.implicitly_wait(5)
                sleep(5)
                
                body=driver.find_element(By.TAG_NAME, 'body')
                body.send_keys(Keys.END)
                sleep(1)
                
                print()
                print(i, driver.current_url)
                print()
                
                products = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'flu7YgFW2k')))
                for product in products:
                    product_name = product.find_element(By.CLASS_NAME, '_26YxgX-Nu5').text
                    if KeyWi.exist_product(product_name):
                        print(f"\n{product_name} 존재.\n")
                        continue
                    product_url=product.find_element(By.TAG_NAME, 'a').get_attribute('href')
                    price = int(product.find_element(By.CLASS_NAME, '_2DywKu0J_8').text.replace(',',''))
                    product_image = product.find_elements(By.CLASS_NAME, '_25CKxIKjAk')[-1].get_attribute('src')
                    
                    # 세부 카테고리 Id 할당 안된 애들 할당해주기
                    category_id=0
                    if cid > 3:
                        category_id=cid
                    
                    # 1. 키보드 케이스(하우징)
                    elif cid == 1:
                        if 'PCB' in product_name or '보강판' in product_name or '전용' in product_name or '악세사리' in product_name or '범폰' in product_name:
                            continue
                        for hn, cate in Data.housing.items():
                            if hn in product_name:
                                category_id=cate
                                break
                        if category_id==0: category_id=13
                    
                    # 2. 스위치(지온웍스)
                    elif cid == 2:
                        frag=False
                        for r in Data.geon_remove:
                            if r in product_name:
                                frag=True
                                break
                        if frag:continue
                        for switch in Data.geon_switch:
                            if switch in product_name:
                                category_id=Data.geon_mapping[switch]
                                break
                        if category_id==0:category_id=2
                    
                    # 3. 키캡(스웨그키)
                    elif cid == 3:
                        descrpt=product.find_elements(By.TAG_NAME, 'p')
                        # 상품 설명이 있다면 거기서 가져오기
                        if descrpt:
                            for cap, cate in Data.keycap.items():
                                if cap in descrpt[0].text:
                                    category_id=cate
                                    break
                        # 없다면 상품명에서 가져오기
                        else:
                            for cap, cate in Data.keycap.items():
                                if cap in product_name:
                                    category_id=cate
                                    break
                        # 찾지못하면 기타분류
                        if category_id==0: category_id=21
                    
                    if category_id in [2,14,15,16,17] and price>1200 and price<14000: price=price//10
                    
                    product_id+=1
                    
                    print(product_id, category_id, product_name, price, product_url, product_image)
                    
                    product_list[product_id]=(category_id, product_name, price, product_url, product_image, None)
                    # KeyWi.insert_product(category_id, product_name, price, product_url, product_image)
            driver.close()
            driver.switch_to.window(driver.window_handles[-1])
        
    return product_list, product_id