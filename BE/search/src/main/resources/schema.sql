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
                           content text,
                           hashtags text,
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

