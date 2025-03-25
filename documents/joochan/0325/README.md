# 4주차

## 25.03.25



## 1. 프론트 자동 배포

이전에 만든 자동 배포는 Vercel 무료 플랜으로는 팀 기능 제한 때문에 다른 팀원이 올린 커밋으론 빌드할 수 없어 사용하지 못하였다.

하여, 남은 2 가지 방법은 netlify를 통한 배포, 그리고 개인 서버에 올리는 방법 2 가지가 있다.

어느것이 더 나을지 몰라 2 가지 모두 시도해 보았다.



### 1. Netlify 배포

기존의 파이프라인으로는 모든 브랜치를 가져오지 못하여 해당 기능만 수정하였고, 로직은 이전과 유사하다.

Gitlab push -> Jenkins Webhook 감지 -> Github mirror -> netlify 감지 -> 빌드 후 배포

```groovy
pipeline {
    agent any
    tools {  // 기본 툴 지정
        git 'Default Git'
    }
    environment {  // 깃랩 레포 URL
        GITLAB_BASE_URL = 'https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21E202'
    }
    stages {
        stage('Clone Mirror') {
            steps {
                script {
                    def repoExists = fileExists('.git')  // 레포 존재여부
                    if (repoExists) {  // 있다면 갱신
                        echo "Repository exists. Updating..."
                        try {
                            checkout([  // 디벨롭브랜치로 체크아웃해서 가져오기
                                $class: 'GitSCM',
                                branches: [[name: '*/develop']],
                                userRemoteConfigs: [[
                                    url: "${GITLAB_BASE_URL}.git",
                                    credentialsId: 'gitlab-credentials'
                                ]],
                                extensions: [
                                    [$class: 'CleanBeforeCheckout'],
                                    [$class: 'PruneStaleBranch']
                                ]
                            ])
                            withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials')]) {
                                sh """ // 원격 레포 목록 갱신
                                    git fetch --all --prune
                                    git remote update --prune
                                    git gc --prune=now
                                """
                                
                                sh '''  // 정보 갱신 후 각 원격 브랜치 로컬 레포로 가져오기 
                                    git fetch --all
                
                                    git branch -r | grep -v '\\->' | while read remote; do
                                        local_branch="${remote#origin/}"
                                        
                                        if ! git rev-parse --verify "$local_branch" >/dev/null 2>&1; then
                                            git branch --track "$local_branch" "$remote"
                                        fi
                                    done
                
                                    git pull --all
                                '''
                            }
                        } catch (Exception e) {
                            echo "Error during update: ${e.message}"
                            error "Failed to update repository"
                        }
                    } else {  // 없다면 클론해서 가져오기
                        echo "Repository does not exist. Cloning..."
                        try {
                            withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials')]) {
                                sh "git clone ${GITLAB_BASE_URL}.git ."  // 현위치에 레포 클론
                                sh "git checkout develop"  // 디벨롭으로 체크아웃
                                
                                sh '''
                                    git fetch --all
                
                                    git branch -r | grep -v '\\->' | while read remote; do
                                        local_branch="${remote#origin/}"
                                        
                                        if ! git rev-parse --verify "$local_branch" >/dev/null 2>&1; then
                                            git branch --track "$local_branch" "$remote"
                                        fi
                                    done
                
                                    git pull --all
                                '''
                            }
                        } catch (Exception e) {
                            echo "Error during clone: ${e.message}"
                            error "Failed to clone repository"
                        }
                    }
                    echo "Branch mirror Successfull."
                }
            }
        }
        stage('Push Mirror') {
            steps {
                script {
                    withCredentials([gitUsernamePassword(credentialsId: 'github_credentials')]) {
                        sh """  // 깃헙으로 미러 푸시
                            git push -f --mirror https://github.com/PoloCeleste/KeyWi.git
                        """
                    }
                    
                    echo "Mirror Push Successfull."
                }
            }
        }
    }
    post {
        always {  // 워크스페이스 정리
            echo "Cleaning."
            cleanWs(cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true)
        }
    }
}

```

이후 netlify에서 develop 브랜치를 빌드하는 걸로 잡아서 배포하였다.

<img src="https://github.com/user-attachments/assets/b843447e-8508-452c-9005-4dc2e8b56d31" alt="Image" style="zoom: 67%;" />



하지만 netlify에서 할당된 서버가 미국 오하이오주 서버여서 로딩에 약간의 딜레이가 발생하는걸 확인하였다.



### 2. 개인서버 배포

윈도우에 올린 WSL(Ubuntu 22.04)를 윈도우에서 포트포워딩하고, 공유기에서도 포트포워딩하여 외부 접속을 허용해준다.

서버에 먼저 nginx와 node.js, npm을 설치해준다.

```bash
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc  # bashrc

nvm install --lts
nvm use --lts
```



windows의 인바운드규칙과 아웃바운드규칙에 사용할 포트를 추가해준 뒤, 포트포워딩을 해준다. (윈도우 작업스케쥴러 사용)

```powershell
$remoteport = wsl hostname -I  # wsl에서 할당된 ip주소 가져오기
$ports = @(22, 80, 443, 8000, 8080, 3670)  # 포워딩할 포트 번호
Invoke-Expression "netsh interface portproxy reset"
foreach ($port in $ports) {  # 각 포트 포트포워딩
    Invoke-Expression "netsh interface portproxy add v4tov4 listenport=$port connectport=$port connectaddress=$remoteport"
}
netsh interface portproxy show all  # 결과 확인
```



wsl에서 ufw 적용 후 ssl 발급하고 nginx 설정

```bash
sudo apt update && sudo apt install openssh-server -y  # ssh 설치
# 방화벽 등록
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# ssh 외부 접속 허용
sudo nano /etc/ssh/sshd_config
# /etc/ssh/sshd_config
ListenAddress 0.0.0.0  # 외부 모든 IP 접속 허용

# ssl 키 발급
sudo certbot certonly --nginx -d keywi.poloceleste.site

# nginx 페이지 설정
sudo nano /etc/nginx/sites-available/default
# /etc/nginx/sites-available/default
server {
    listen 80;
    listen 443 ssl;
    server_name keywi.poloceleste.site;
	
	# ssl 해제
    ssl_certificate     /etc/letsencrypt/live/keywi.poloceleste.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/keywi.poloceleste.site/privkey.pem;

    location / {
        root /var/www/keywi;  # 권한 문제로 인해 해당 위치로 빌드한 정적 페이지 이동
        index index.html;  # 기본 페이지
        try_files $uri /index.html;  # 없는 uri 접속 할 시 기본 페이지로 이동
    }

    location = /50x.html {  # 500번대 에러 발생 시 에러 페이지 보여주기
        root /usr/share/nginx/html;
    }
}

```



이후 Jenkins에서 빌드 자동화 파이프라인 작성해준다.

```groovy
pipeline {
    agent any
    tools {
        git 'Default Git'
    }
    environment {
        GITLAB_BASE_URL = 'https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21E202'
        BRANCH_NAME = 'develop'
        SERVER_USER = 'celeste'
        SERVER_HOST = 'keywi.poloceleste.site'
        SERVER_WORK_DIR = '/home/celeste/KeyWi/FE/keywi'
    }
    stages {
        stage('Clone and Checkout') {  // 클론받고 디벨롭 체크아웃  -> 디벨롭만 빌드
            steps {
                script {  // 깃랩 인증 정보 가져와서
                    withCredentials([usernamePassword(credentialsId: 'gitlab-credentials', usernameVariable: 'GITLAB_USER', passwordVariable: 'GITLAB_PASS')]) {
                        sshagent(['ody-server']) {  // 원격 서버 접속
                            sh """
                                ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "
                                    if [ ! -d ~/KeyWi ]; then  // 홈에 키위폴더 없으면
                                        echo 'KeyWi folder does not exist'
                                        cd ~ &&  // 클론 받아서 체크아웃
                                        git clone https://${GITLAB_USER}:${GITLAB_PASS}@lab.ssafy.com/s12-fintech-finance-sub1/S12P21E202.git KeyWi &&
                                        cd KeyWi &&
                                        git checkout -B ${BRANCH_NAME} origin/${BRANCH_NAME} --force
                                    else  // 존재하면
                                        echo 'KeyWi folder exists'
                                        cd ~/KeyWi &&  // 키위폴더 디벨롭 브랜치로 갱신
                                        git fetch --all &&
                                        git reset --hard origin/${BRANCH_NAME}
                                    fi
                                "
                            """
                        }
                    }
                    echo "Branch checked out Successfull"
                }
            }
        }
        stage('Send .env') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'react-env', variable: 'ENV_FILE')]) {
                        sshagent(['ody-server']) {  // env파일 전송하기
                            sh """
                                ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "
                                    cd ${SERVER_WORK_DIR}
                                    rm .env  // 기존꺼 지우고 -> 권한문제
                                "
                                scp -o StrictHostKeyChecking=no "$ENV_FILE" ${SERVER_USER}@${SERVER_HOST}:${SERVER_WORK_DIR}/.env  // 새로 전송
                            """
                        }
                    }
                    
                    echo ".env sent."
                }
            }
        }
        stage('Build on Remote Server') {
            steps {
                script {
                    sshagent(['ody-server']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "
                                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash  // nvm 설치
                                source ~/.zshrc
                                cd ${SERVER_WORK_DIR}
                                nvm use --lts  // 최신버전 사용  -> 최신버전 설치되어 있으나, 계속 오래된 버전이 잡힘. 직접 ssh로 접속해서 해보면 최신버전 잘 잡힘
                                npm -v
                                node -v
                                npm install  // 패키지 설치하고
                                npm run build  // 페이지 빌드 후
                                sudo rm -rf /var/www/keywi
                                sudo mv /home/celeste/KeyWi/FE/keywi/dist /var/www/keywi  // 배포 위치로 이동
                                sudo systemctl restart nginx  // 엔지닉스 재시작
                            "
                        """
                    }
                    echo "Built Completed."
                }
            }
        }
    }
    post {
        always {  // 워크스페이스 비우기
            echo "Cleaning."
            cleanWs(cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true)
        }
    }
}

```

