drop database keywi;

create database keywi;

use keywi;

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
                       hashtags json,
                       created_at datetime default current_timestamp,
                       foreign key (user_id) references users(user_id)
);

CREATE TABLE category (
                          `category_id` INT NOT NULL AUTO_INCREMENT,
                          `category_name` VARCHAR(255) NOT NULL,
                          `parent_id` INT DEFAULT NULL,
                          PRIMARY KEY (`category_id`),
                          FOREIGN KEY (`parent_id`) REFERENCES category(`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
                          `product_id` INT NOT NULL AUTO_INCREMENT,
                          `product_name` VARCHAR(255) NOT NULL,
                          `price` INT NOT NULL,
                          `description` TEXT,
                          `category_id` INT NOT NULL,
                          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                          PRIMARY KEY (`product_id`),
                          FOREIGN KEY (`category_id`) REFERENCES category(`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE post_product_tag (
                                  post_id int,
                                  product_id int,
                                  PRIMARY KEY (post_id, product_id),
                                  FOREIGN KEY (post_id) REFERENCES posts(post_id),
                                  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

create table board (
                       board_id        int          not null    auto_increment ,
                       writer_id       int             not null ,
                       title           varchar(255)    not null ,
                       description     text            not null ,
                       thumbnail_url   varchar(255)    not null ,
                       deal_state      varchar(20)     not null ,
                       view_cnt        int             not null ,
                       created_at      datetime default current_timestamp ,
                       updated_at      datetime ,
                       primary key (board_id) ,
                       foreign key (writer_id) references users(user_id)
);

create table board_images (
                              image_id        int             not null    auto_increment,
                              board_id        int             not null ,
                              image_url       varchar(255) ,
                              display_order   int ,
                              primary key (image_id) ,
                              foreign key (board_id) references board (board_id)
);

create table board_products (
                                board_post_id       int     not null    auto_increment ,
                                board_id            int     not null ,
                                product_id          int     not null ,
                                category_id         int     not null ,
                                created_at          datetime default current_timestamp ,
                                primary key (board_post_id) ,
                                foreign key (board_id) references board(board_id) ,
                                foreign key (product_id) references products(product_id) ,
                                foreign key (category_id) references products(category_id)
);

create table wishes (
                        wish_id     int     not null    auto_increment ,
                        user_id     int     not null ,
                        product_id  int     not null ,
                        category_id int     not null ,
                        updated_at datetime not null ,
                        primary key (wish_id) ,
                        foreign key (user_id) references users(user_id) ,
                        foreign key (product_id) references products(product_id),
                        foreign key (category_id) references products(category_id)

)