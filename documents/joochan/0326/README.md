# 4주차

## 25.03.26



## 서버 세팅

### 1. RabbitMQ 설치

```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl gnupg apt-transport-https erlang erlang-base # RabbitMQ는 erlang 기반

# RabbitMQ 저장소 추가 및 키 설치
# ubuntu 24버전 미만
echo 'deb http://www.rabbitmq.com/debian/ testing main' | sudo tee /etc/apt/sources.list.d/rabbitmq.list
wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -

#ubuntu 24버전 이상
curl -fsSL https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo gpg --dearmor -o /usr/share/keyrings/rabbitmq-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/rabbitmq-archive-keyring.gpg] http://www.rabbitmq.com/debian/ testing main" | sudo tee /etc/apt/sources.list.d/rabbitmq.list

# RabbitMQ 설치
sudo apt-get update && sudo apt-get install rabbitmq-server -y

### 문제 발생시
sudo rm -f /etc/apt/sources.list.d/rabbitmq.list

sudo apt-get update && sudo apt-get install -y curl gnupg apt-transport-https

curl -fsSL https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo tee /usr/share/keyrings/erlang.gpg > /dev/null
curl -fsSL https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey | sudo tee /usr/share/keyrings/rabbitmq.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/erlang.gpg] https://packages.erlang-solutions.com/ubuntu $(lsb_release -cs) contrib" | sudo tee /etc/apt/sources.list.d/erlang.list
echo "deb [signed-by=/usr/share/keyrings/rabbitmq.gpg] https://packagecloud.io/rabbitmq/rabbitmq-server/ubuntu $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/rabbitmq.list

sudo apt-get update && sudo apt install -y erlang-base rabbitmq-server



sudo ufw allow 5672 # 외부 접속
sudo ufw allow 15672 # 관리콘솔 외부접속 허용
sudo ufw reload

sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server

# 관리 플러그인 활성화
sudo rabbitmq-plugins enable rabbitmq_management

#ubuntu User can only log in via localhost
# 외부 접속하면 guest로 로그인 불가이므로 유저 만들어줘야 함 / 관리자권한 부여
sudo rabbitmqctl add_user 유저명 비밀번호
sudo rabbitmqctl set_user_tags 유저명 administrator
sudo rabbitmqctl set_permissions -p / 유저명 ".*" ".*" ".*"
```



### 2. zookeeper/kafka 설치

실행순서 : zookeeper -> kafka



```bash
# kafka 다운로드 (3.7.0 버전 사용)
cd /opt
sudo wget https://archive.apache.org/dist/kafka/3.7.0/kafka_2.13-3.7.0.tgz

# 압축 해제 후 폴더명 정리
sudo tar -xvzf kafka_2.13-3.7.0.tgz
sudo mv kafka_2.13-3.7.0 kafka

# 환경변수 등록
export PATH=$PATH:/opt/kafka/bin

# 서비스 생성 및 등록
sudo nano /etc/systemd/system/zookeeper.service
#/etc/systemd/system/zookeeper.service
[Unit]
Description=Zookeeper Service
After=network.target

[Service]
Type=simple
ExecStart=/opt/kafka/bin/zookeeper-server-start.sh /opt/kafka/config/zookeeper.properties
ExecStop=/opt/kafka/bin/zookeeper-server-stop.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target


sudo nano /etc/systemd/system/kafka.service
#/etc/systemd/system/kafka.service
[Unit]
Description=Apache Kafka Server
After=network.target zookeeper.service
Requires=zookeeper.service

[Service]
Type=simple
User=root
ExecStart=/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
ExecStop=/opt/kafka/bin/kafka-server-stop.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target


# 서비스 등록 및 실행
sudo systemctl daemon-reload
sudo systemctl enable zookeeper
sudo systemctl start zookeeper
sudo systemctl enable kafka
sudo systemctl start kafka
```





