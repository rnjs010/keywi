from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from time import sleep
from bs4 import BeautifulSoup
from pprint import pprint
import mysql.connector
import json

'''
CREATE TABLE category (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    parent_id INT NULL
);

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    product_url VARCHAR(500) NOT NULL,
    product_image VARCHAR(255),
    options VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE products_descriptions (
    product_description_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    description_image_url VARCHAR(500) NOT NULL,
    description_order INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
'''

if __name__ == "__main__":
    
    db = mysql.connector.connect(
        host='127.0.0.1',#input("host: "),
        user='ssafy',#input("mysql user: "),
        password='ssafy',#input("mysql password: "),
        database="KeyWi"
    )
    
    cursor = db.cursor()
    
    def insert_category(category_name, parent_id=None):
        cursor.execute("INSERT INTO category (category_name, parent_id) VALUES (%s, %s)", (category_name, parent_id))
        db.commit()
        return cursor.lastrowid
    
    def insert_product(category_id, product_name, price, product_url, product_image=None, options=None):
        cursor.execute(
            "INSERT INTO products (category_id, product_name, price, product_url, product_image, options) VALUES (%s, %s, %s, %s, %s, %s)",
            (category_id, product_name, price, product_url, product_image, options)
        )
        db.commit()
        return cursor.lastrowid

    def insert_product_description(product_id, description_image_url, description_order):
        cursor.execute(
            "INSERT INTO products_descriptions (product_id, description_image_url, description_order) VALUES (%s, %s, %s)",
            (product_id, description_image_url, description_order)
        )
        db.commit()
    
    def exist_product(product_name):
        cursor.execute("SELECT EXISTS(SELECT 1 FROM products WHERE product_name = %s)", (product_name,))
        return cursor.fetchone()[0]
    
    
    def select_product(start=1, end=None):
        query="SELECT * from products WHERE product_id >= %s" + (" and product_id <= %s" if end else "")
        sele=(start, end,) if end else (start,)
        cursor.execute(query, sele)
        return cursor.fetchall()
    
    
    category=["case", 'switch', 'keycap', 'pcb', 'plate', 'stabilizer', 'foam']  # 1, 2, 3, 4, 5, 6, 7
    detail={
        1:['60%', '65%', '75%', '80%', '100%', 'case-etc'],  # 8, 9, 10, 11, 12, 13
        2:['linear', 'tactile', 'low-noise', 'magnetic'],  # 14, 15, 16, 17
        3:['double-shot', 'dye-sub', 'artisan', 'cap-etc'],  # 18, 19, 20, 21
        6:['pcb-mount', 'plate-mount'],  # 22, 23
    }
    
    # for c in category:
    #     print(insert_category(c))
    
    # for parent, ca in detail.items():
    #     for c in ca:
    #         print(insert_category(c, parent), c)
    
    # for p in select_product():
    #     print(p)
    
    
    options=Options()
    options.add_argument("log-level=3")
    options.add_argument("lang=ko_KR")
    options.add_argument("--window-size=1920,1080")
    # options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument("user-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Whale/4.30.291.11 Safari/537.36")
    options.add_argument("--start-maximized")  # 창 최대화
    # options.add_argument("--headless") # 숨김
    options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
    options.add_experimental_option("useAutomationExtension", False)
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    wait = WebDriverWait(driver, 5)
    
    
    baseURL="https://smartstore.naver.com"
    swegkey="/swagkey"
    geonworks="/geonlab"
    query="?st=RECENT&dt=IMAGE&page=1&size=80"
    
    
    swegkeyList=["스위치", "키보드", "키캡", "기판 & 파츠", "스테빌라이저", "툴"]
    # 만약 1~3 사이 숫자가 들어있다면, 제목/설명 기반으로 카테고리 추출 - 쉑키는 설명(_1enCFJskWo)에, 지온은 처음부터 분류됨
    swegkeyDic={
        "스위치":[["마그네틱 스위치", 17], ["저소음", 16], ["리니어", 14], ["택타일", 15]],
        "키보드":[["Swagkeys", 1], ["Owlab", 9], ["QK", 1], ["Neo", 1], ["MatrixLab", 13], ["MODE", 9], ["Angrymiao", 9], ["Whatever Studio", 11], ["Omnitype", 9], ["TKD", 1], ["FoxLab", 9]],
        # 분류가 붙으면 그대로 넣고, 안붙은거는 제목에서 가져가기
        "키캡":[["SW", 3],["FBB", 3],["Keyreative", 3],["Hammerworks", 3],["DMK", 3],["MilkyWay", 3],["GMK", 3],["JKDK",3],["JTK", 3],["PBTfans", 3],["아티산", 20],["기타 키캡", 3]],
        # sweg 키캡은 상품 설명에서 분류 가져오기
        "기판 & 파츠":[["기판", 4], ["보강판", 5]],
        "스테빌라이저":[["무보강용(PCB)", 22], ["보강용(Plate)", 23]],
        "툴":[["필름", 7], ["흡음재", 7]]
    } # 있으면 넣지 않음
    #['60%', '65%', '75%', '80%', '100%', 'case-etc'],  # 8, 9, 10, 11, 12, 13
    housing={
        '60':8,
        '65':9,
        '75':10,
        '80':11,
        '100':12,
        '101':12,
        '트랜지션':11,
        'Cycle':11,
        'MINI':8,
        'TKL':11
    }
    
    geonList=["VENOM", "PCB & 보강판", "키보드", "스위치", "스테빌라이저", "키캡", "흡음재"]
    geonDic={
        "VENOM":[['케이스', 1], ['기판', 4], ['보강판', 5]],  # 각자 카테고리로 넣기
        "PCB & 보강판":[['PCB', 4], ['보강판', 5]],
        "키보드":[['Margo65', 9], ['MAGNUM65', 9], ['TIGER F13', 11], ['FROG TKL', 11], ['DUNE 65', 9]],
        "스위치":False,  # 이름에서 카테고리 추출하기 => "자석축", "저소음", "리니어", "넌클릭" 순
        "스테빌라이저":[["PCB(무보강)용", 22], ["보강용", 23]],
        "키캡":[['이중사출', 18], ['염료승화', 19], ['금속 아티산', 20], ['기타', 21]],
        "흡음재":False
    }
    geoncate={"스위치":2, "흡음재":7}
    
    geonSwitch=['자석축', '저소음', '리니어', '넌클릭']
    
    geonMapping={
        '자석축':17,
        '저소음':16,
        '리니어':14,
        '넌클릭':15
    }
    geonRemove=['스템', '스프링', '폼', '와셔', '디퓨저'] # 이름으로 제거
    
    keycap={
        '염료승화':19,
        '이중사출':18,
        '아티산':20
    }
    
    
    productList={}
    product_id=0
    
    def today():
        try:
            today_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[contains(text(),'오늘하루 안보기')]")))
            sleep(0.5)
            today_button.click()
        except:
            print("팝업 없음")
    
    
    def cr(URL, List, Dic):
        global product_id
        driver.get(baseURL+URL)
        driver.implicitly_wait(5)
        act=ActionChains(driver)
        
        # 탭 목록 저장용
        tab={}
        driver.execute_script(f'window.open("{driver.current_url}");')
        driver.switch_to.window(driver.window_handles[-1])
        tab[0]=driver.current_window_handle
        today()
        
        for l in List:
            menu = wait.until(EC.element_to_be_clickable((By.ID,"pc-categoryMenuWidget")))
            
            # 메뉴 더보기 버튼 누르기
            try:
                moreButton=menu.find_element(By.XPATH, f"//button[text()='더보기']") #By.CLASS_NAME, "_3ryPAjhmjZ")
                moreButton.click()
                sleep(0.5)
            except:print("이미 열림")
            
            sub=menu.find_element(By.XPATH, f"//a[text()='{l}']")
            act.move_to_element(sub).perform()
            sleep(0.3)
            
            if Dic[l]:
                # 마우스 호버해서 얻은 세부 카테고리
                submenu=wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "T20614P231")))
                for detail, categoryId in Dic[l]:
                    d=submenu.find_element(By.XPATH, f"//a[text()='{detail}']")
                    detailpage=d.get_attribute('href').replace("?cp=1", query)
                    print(detail, detailpage)
                    driver.execute_script(f'window.open("{detailpage}");')
                    driver.switch_to.window(driver.window_handles[-1])
                    if categoryId in tab:
                        tab[categoryId]+=[driver.current_window_handle]
                    else:tab[categoryId]=[driver.current_window_handle]
                    driver.switch_to.window(tab[0])
            else:
                subpage=sub.get_attribute('href').replace("?cp=1", query)
                print(l, subpage)
                driver.execute_script(f'window.open("{subpage}");')
                driver.switch_to.window(driver.window_handles[-1])
                if geoncate[l] in tab:
                    tab[geoncate[l]]+=[driver.current_window_handle]
                else: tab[geoncate[l]]=[driver.current_window_handle]
                driver.switch_to.window(tab[0])
        
        productList={}
        
        for categoryId, pages in tab.items():
            if categoryId==0:continue
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
                    pagebtn=pagenation.find_element(By.XPATH,f"//a[text()='{i}']")
                    pagebtn.click()
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
                        if exist_product(product_name):
                            print(f"\n{product_name} 존재.\n")
                            continue
                        product_url=product.find_element(By.TAG_NAME, 'a').get_attribute('href')
                        price = int(product.find_element(By.CLASS_NAME, '_2DywKu0J_8').text.replace(',',''))
                        product_image = product.find_elements(By.CLASS_NAME, '_25CKxIKjAk')[-1].get_attribute('src')
                        
                        # 세부 카테고리 Id 할당 안된 애들 할당해주기
                        category_id=0
                        if categoryId > 3:
                            category_id=categoryId
                        
                        # 1. 키보드 케이스(하우징)
                        elif categoryId == 1:
                            if 'PCB' in product_name or '보강판' in product_name or '전용' in product_name or '악세사리' in product_name or '범폰' in product_name:
                                continue
                            for hn, cate in housing.items():
                                if hn in product_name:
                                    category_id=cate
                                    break
                            if category_id==0: category_id=13
                        
                        # 2. 스위치(지온웍스)
                        elif categoryId == 2:
                            frag=False
                            for r in geonRemove:
                                if r in product_name:
                                    frag=True
                                    break
                            if frag:continue
                            for switch in geonSwitch:
                                if switch in product_name:
                                    category_id=geonMapping[switch]
                                    break
                            if category_id==0:category_id=2
                        
                        # 3. 키캡(스웨그키)
                        elif categoryId == 3:
                            descrpt=product.find_elements(By.TAG_NAME, 'p')
                            # 상품 설명이 있다면 거기서 가져오기
                            if descrpt:
                                for cap, cate in keycap.items():
                                    if cap in descrpt[0].text:
                                        category_id=cate
                                        break
                            # 없다면 상품명에서 가져오기
                            else:
                                for cap, cate in keycap.items():
                                    if cap in product_name:
                                        category_id=cate
                                        break
                            # 찾지못하면 기타분류
                            if category_id==0: category_id=21
                        
                        if category_id in [2,14,15,16,17] and price>1200 and price<14000: price=price//10
                        
                        product_id+=1
                        
                        print(product_id, category_id, product_name, price, product_url, product_image)
                        
                        productList[product_id]=(category_id, product_name, price, product_url, product_image, None)
                        insert_product(category_id, product_name, price, product_url, product_image)
                driver.close()
                driver.switch_to.window(driver.window_handles[-1])
            
        return productList
    
    # swegkey_product=cr(swegkey, swegkeyList, swegkeyDic)
    swegkey_product={}
    products=select_product(end=470)
    for key, *value in products: swegkey_product[key]=value
    # pprint(swegkey_product)
    with open("swegkey_product.json", "w", encoding="utf-8") as json_file:
        json.dump(swegkey_product, json_file, indent=4, ensure_ascii=False)

    print("swegkey_product JSON 파일이 성공적으로 저장되었습니다!")
    
    # geon_product=cr(geonworks, geonList, geonDic)
    geon_product={}
    products=select_product(start=471)
    for key, *value in products:geon_product[key]=value
    # pprint(geon_product)
    with open("geon_product.json", "w", encoding="utf-8") as json_file:
        json.dump(geon_product, json_file, indent=4, ensure_ascii=False)

    print("geon_product JSON 파일이 성공적으로 저장되었습니다!")
    
    driver.quit()