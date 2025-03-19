import mysql.connector
from getpass4 import getpass
from base import StoreData

Data=StoreData()
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
    detail_description VARCHAR(500) NOT NULL,
    description_order INT NOT NULL,
    content_type ENUM('text', 'image', 'hr') NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
'''

class DBs:
    def __init__(self):
        self.DB = mysql.connector.connect(
            host=input("host: "),
            user=input("mysql user: "),
            password=getpass("mysql password: "),
            database="KeyWi"
        )
        self.cursor = self.DB.cursor()
    
    def __str__(self):
        return self.DB.is_connected()
        
    def insert_category(self, category_name, parent_id=None):
        self.cursor.execute("INSERT INTO category (category_name, parent_id) VALUES (%s, %s)", (category_name, parent_id))
        self.DB.commit()
        return self.cursor.lastrowid

    def insert_product(self, category_id, product_name, price, product_url, product_image=None, options=None):
        self.cursor.execute(
            "INSERT INTO products (category_id, product_name, price, product_url, product_image, options) VALUES (%s, %s, %s, %s, %s, %s)",
            (category_id, product_name, price, product_url, product_image, options)
        )
        self.DB.commit()
        return self.cursor.lastrowid

    def insert_product_description(self, product_id, detail_description, description_order, content_type):
        self.cursor.execute(
            "INSERT INTO products_descriptions (product_id, detail_description, description_order, content_type) VALUES (%s, %s, %s, %s)",
            (product_id, detail_description, description_order, content_type)
        )
        self.DB.commit()

    def exist_product(self, product_name):
        self.cursor.execute("SELECT EXISTS(SELECT 1 FROM products WHERE product_name = %s)", (product_name,))
        return self.cursor.fetchone()[0]


    def select_product(self, start=1, end=None):
        query="SELECT * from products WHERE product_id >= %s" + (" and product_id <= %s" if end else "")
        sele=(start, end,) if end else (start,)
        self.cursor.execute(query, sele)
        return self.cursor.fetchall()

    def make_category(self):
        for c in Data.category:
            print(self.insert_category(c), c)
        
        for parent, ca in Data.detail.items():
            for c in ca:
                print(self.insert_category(c, parent), c)