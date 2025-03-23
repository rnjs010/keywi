create table users (
                       user_id int auto_increment primary key,
                       user_name varchar(255),
                       user_nickname varchar(255),
                       brix int
);

create table posts (
                       post_id int auto_increment primary key,
                       user_id int,
                       content TEXT,
                       hashtags text,
                       created_at datetime default current_timestamp,
                       foreign key (user_id) references users(user_id)
);

create table products (
                          product_id int auto_increment primary key ,
                          product_name VARCHAR(255),
                          description TEXT,
                          price int,
                          created_at datetime default current_timestamp
);

CREATE TABLE post_product_tag (
                                  post_id int,
                                  product_id int,
                                  PRIMARY KEY (post_id, product_id),
                                  FOREIGN KEY (post_id) REFERENCES posts(post_id),
                                  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

# create table categories (
                              #     category_id int auto_increment primary key ,
                              #     category_name varchar(255),
                              # )

