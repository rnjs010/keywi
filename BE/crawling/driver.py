from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
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
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE products_descriptions (
    product_description_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    description_image_url VARCHAR(255) NOT NULL,
    options VARCHAR(500),
    description_order INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
'''

if __name__ == "__main__":
    
    db = mysql.connector.connect(
        host="127.0.0.1",#input("host: "),
        user="ssafy",#input("mysql user: "),
        password="ssafy",#input("mysql password: "),
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
    
    def select_product():
        cursor.execute("SELECT * from category")
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
        "스위치":[["마그네틱 스위치", 17], ["저소음", 16], ["리니어", 14], ["텍타일", 15]],
        "키보드":[["Swagkeys", 1], ["Owlab", 9], ["QK", 1], ["Neo", 1], ["MatrixLab", 13], ["MODE", 9], ["Angrymiao", 9], ["Whatever Studio", 11], ["Omnitype", 9], ["TKD", 1], ["FoxLab", 9]],
        # 분류가 붙으면 그대로 넣고, 안붙은거는 제목에서 가져가기
        "키캡":[["SW", 3],["FBB", 3],["Keyreative", 3],["Hammerworks", 3],["DMK", 3],["MilkyWay", 3],["GMK", 3],["JKDK",3],["JTK", 3],["PBTfans", 3],["아티산", 20],["기타 키캡", 3]],
        # sweg 키캡은 상품 설명에서 분류 가져오기
        "기판 & 파츠":[["기판", 4], ["보강판", 5]],
        "스테빌라이저":[["무보강용(PCB)", 22], ["보강용(Plate)", 23]],
        "툴":[["필름", 7], ["흡음재", 7]]
    } # 있으면 넣지 않음
    
    
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
    
    geonSwitch=['자석축', '저소음', '리니어', '넌클릭']
    mapping={
        '자석축':17,
        '저소음':16,
        '리니어':14,
        '넌클릭':15
    }
    geonRemove={
        '스위치':['스템', '스프링', '폼', '와셔'],
        '흡음재':False
    } # 이름으로 제거
    
    
    driver.get(baseURL+swegkey)
    driver.implicitly_wait(5)
    act=ActionChains(driver)
    
    product_id=0
    
    def today():
        try:
            today_button = wait.until(EC.element_to_be_clickable((By.XPATH,"//button[contains(text(),'오늘하루 안보기')]")))
            sleep(0.5)
            today_button.click()
        except:
            print("팝업 없음")
    
    
    def cr(List, Dic):
        today()
        # 탭 목록 저장용
        tab={}
        maintab=driver.current_window_handle
        
        for l in List:
            menu = wait.until(EC.element_to_be_clickable((By.ID,"pc-categoryMenuWidget")))
            moreButton=menu.find_element(By.CLASS_NAME, "_3ryPAjhmjZ")
            moreButton.click()
            sleep(0.5)
            
            sub=menu.find_element(By.XPATH, f"//a[contains(text(),'{l}')]")
            act.move_to_element(sub).perform()
            sleep(0.3)
            
            if not Dic[l]:
                submenu=wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "T20614P231")))
                for detail, categoryId in Dic[l]:
                    d=submenu.find_element(By.XPATH, f"//a[contains(text(),'{detail}')]")
                    detailpage=d.get_attribute('href').replace("?cp=1", query)
            else:
                subpage=sub.get_attribute('href').replace("?cp=1", query)
                driver.execute_script(f'window.open("{subpage}");')
                driver.switch_to.window(driver.window_handles[-1])
                tab[l]=driver.current_window_handle
    
        productsURL=[]
        for _, page in tab.items():
            driver.switch_to.window(page)
            sleep(1)
            driver.implicitly_wait(5)
            
            body=driver.find_element(By.TAG_NAME, 'body')
            body.send_keys(Keys.END)
            sleep(1)
            
            pagenation=body.find_element(By.CLASS_NAME, "_2UJrM31-Ry")
            pages=len(pagenation.find_elements(By.CLASS_NAME, "UWN4IvaQza"))
            
            products = wait.until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'flu7YgFW2k')))
            productsURL=productsURL+[(product.find_element(By.TAG_NAME, 'a').get_attribute('href')) for product in products]
            
            print(pages)
    
    
    cr(swegkeyList, swegkeyDic)
    # soup = BeautifulSoup(driver.page_source, 'html.parser')
    # pprint(soup)
    sleep(10)
    
    # with open("database_structure.json", "w", encoding="utf-8") as json_file:
        # json.dump(data, json_file, indent=4, ensure_ascii=False)

    # print("JSON 파일이 성공적으로 저장되었습니다!")
    driver.quit()