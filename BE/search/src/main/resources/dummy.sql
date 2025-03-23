INSERT INTO users (user_name, user_nickname, brix) VALUES
                                                       ('홍길동', 'gildong', 120),
                                                       ('김영희', 'younghee', 80),
                                                       ('이철수', 'chulsoo', 150);

INSERT INTO products (product_name, description, price) VALUES
                                                            ('앱코 K995 키보드', '기계식 갈축 키보드', 89000),
                                                            ('로지텍 G102 마우스', '게이밍 마우스', 35000),
                                                            ('한성 GK888B', '무접점 키보드', 120000),
                                                            ('LG 울트라와이드 모니터', '34인치 와이드 모니터', 350000),
                                                            ('갤럭시 버즈2', '무선 이어폰', 119000);

INSERT INTO posts (user_id, content, hashtags) VALUES
                                                   (1, '오늘 새로 산 앱코 키보드 완전 만족!', '["#키보드", "#기계식"]'),
                                                   (2, '로지텍 마우스 쓰는 중인데 가성비 굿', '["#마우스", "#로지텍"]'),
                                                   (1, '무접점 키보드 처음 써보는데 신세계야', '["#키보드", "#무접점"]'),
                                                   (3, '버즈2 이어폰 음질 대박', '["#이어폰", "#버즈"]'),
                                                   (2, '와이드 모니터로 멀티 작업 최고!', '["#모니터", "#와이드"]');

INSERT INTO post_product_tag (post_id, product_id) VALUES
                                                       (1, 1), -- 앱코 키보드
                                                       (2, 2), -- 로지텍 마우스
                                                       (3, 3), -- 한성 키보드
                                                       (4, 5), -- 버즈2
                                                       (5, 4); -- LG 모니터