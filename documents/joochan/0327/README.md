# 4주차

## 25.03.27



## 서버 세팅

### 1. maven 설치

```bash
sudo mkdir /usr/local/maven
cd /usr/local/maven

sudo wget https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz
sudo tar -xvzf apache-maven-3.9.9-bin.tar.gz

sudo nano /etc/environment
PATH=":/usr/local/maven/apache-maven-3.9.9/bin" #기존에 추가
MAVEN_HOME="/usr/local/maven/apache-maven-3.9.9"
CLASSPATH="."

source /etc/environment

echo $MAVEN_HOME  # 설치 확인
```

