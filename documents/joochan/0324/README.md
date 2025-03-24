# 4주차

## 25.03.24



## 1. 프론트 자동 배포

싸피 깃랩은 Repository Mirror가 막혀있기 때문에 젠킨스로 미러 해줘야 가능.

#### 1. FreeStyle Project로 시도

1. 깃랩 레포 연결

<img src="https://github.com/user-attachments/assets/56b00ec4-9aa0-4ebc-9cf9-3ac431288760" alt="Image" style="zoom:50%;" />

2. 웹훅 연결

   <img src="https://github.com/user-attachments/assets/c38fd271-01d2-42ae-8685-53a5b1a8cee6" alt="Image" style="zoom: 67%;" />

3. 깃헙 토큰 생성해서 Jenkins에 등록 후 사용

   Github Settings -> Developer Settings -> Personal access tokens -> classic -> Generate

   repo, write:packages, admin:repo_hook 체크 후 생성

   <img src="https://github.com/user-attachments/assets/ca5cdb7e-cbce-4315-a393-f1bd81a05f8f" alt="Image" style="zoom: 50%;" />

   Jenkins Credential에 등록 후 사용

4. Build Steps에 shell scripts 작성
   <img src="./assets/image-20250324120319123.png" alt="image-20250324120319123" style="zoom:50%;" />
   모든 브랜치 갱신해서 가져오기 위해 명령어 작성했으나, shell에서는 깃랩도 따로 인증을 잡아줘야 하기 때문에 명령어가 안먹히는 문제 발생.
   인증 잡아주려면 복잡해져서 파이프라인과 다를바 없기 때문에 파이프라인 프로젝트로 변경.



#### 2. Pipeline Project

1. 웹훅 잡아주고, 파이프라인 작성
   ```groovy
   pipeline {
       agent any  // 모든 에이전트에서 실행 가능
       tools {  // 기본 툴 지정
           git 'Default Git'
       }
       environment {  // 환경변수 설정
           BRANCH_NAME=''
           GITLAB_BASE_URL = 'https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21E202'
           GITHUB_REPO="https://github.com/PoloCeleste/KeyWi.git"
       }
       stages {
           stage('Checkout and Update') {
               steps {
                   script {
                       def repoExists = fileExists('.git')  // .git 폴더 유무로 레포 존재하는지 확인
                       if (repoExists) {  // 존재 한다면
                           echo "Repository exists. Updating..."
                           try {
                               checkout([  // 체크아웃 시도 : 디폴트 브랜치는 디벨롭 - 프론트배포는 디벨롭에서 할거기 때문. 다 따라다니면 복잡해짐
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
                               withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials', gitToolName: 'git-tool')]) {  // 깃랩으로 인증
                                   sh """
                                       git fetch --all --prune
                                       git remote update --prune
                                       git gc --prune=now
                                   """  // 모든 방법 사용해서 변경사항 업데이트해서 가져오기
                                   
                                   BRANCH_NAME = sh(script: """
                                       git ls-remote --sort=-committerdate origin 'refs/heads/*' |
                                       awk -F'/' '{print substr(\$0, index(\$0,\$3))}' |
                                       head -n 1
                                   """, returnStdout: true).trim()
                                   echo "Latest branch: ${BRANCH_NAME}"
   
                                   sh "git checkout -B ${BRANCH_NAME} origin/${BRANCH_NAME} --force"
   							  // 가장 최근에 변경이 발생한 브랜치 찾아서 가져오기
                               }
                               withCredentials([gitUsernamePassword(credentialsId: 'github_credentials', gitToolName: 'git-tool')]) {  // 깃헙으로 인증
                                   sh "git remote set-url --push origin ${GITHUB_REPO}"  // 레포 원격 주소 변경
                                   sh "git push --mirror"  // 미러하기
                               }
                           } catch (Exception e) {  // 문제 생기면 알림
                               echo "Error during update: ${e.message}"
                               error "Failed to update repository"
                           }
                       } else {  // 레포 존재 안한다면
                           echo "Repository does not exist. Cloning..."
                           try {
                               withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials', gitToolName: 'git-tool')]) {  // 깃랩 인증 사용
                                   sh "git clone ${GITLAB_BASE_URL}.git ."  // 원격레포 클론해오기
                                   sh "git checkout develop"  // 기본 브랜치 디벨롭으로 체크아웃
                                   
                                   sh """
                                       git fetch --all --prune
                                       git remote update --prune
                                       git gc --prune=now
                                   """
                                   
                                   BRANCH_NAME = sh(script: """
                                       git ls-remote --sort=-committerdate origin 'refs/heads/*' |
                                       awk -F'/' '{print substr(\$0, index(\$0,\$3))}' |
                                       head -n 1
                                   """, returnStdout: true).trim()
                                   echo "Latest branch: ${BRANCH_NAME}"
                                   // 최근 변경된 브랜치 찾아서 체크아웃 동일
                                   sh "git checkout -B ${BRANCH_NAME} origin/${BRANCH_NAME} --force"
                               }
                               withCredentials([gitUsernamePassword(credentialsId: 'github_credentials', gitToolName: 'git-tool')]) {
                                   sh "git remote set-url --push origin ${GITHUB_REPO}"
                                   sh "git push --mirror"
                               }  // 깃헙인증으로 미러 동일
                           } catch (Exception e) {
                               echo "Error during clone: ${e.message}"
                               error "Failed to clone repository"
                           }
                       }
                   }
               }
           }
       }
       post {
           always { // 항상 작업이 끝나면 워크스페이스 비우기
               cleanWs(cleanWhenNotBuilt: false,
                   deleteDirs: true,
                   disableDeferredWipeout: true,
                   notFailBuild: true)
               
           }
       }
   }
   ```





#### 3. Vercel Github 연동

1. Github에 mirror된 Repo Import 후  먼저 master 브랜치로 연동.

   - 프레임워크 선택

     - 프레임워크에 맞게 빌드 세팅

       - npm run build
       - dist
       - npm install

       <img src="https://github.com/user-attachments/assets/21eda02e-347f-4239-91ac-556f4d09e3cc" alt="Image" style="zoom: 33%;" />

   - 루트 디렉토리는 브랜치 변경 후 작성. (디벨롭에서 올릴거기 때문)

   먼저 배포 버튼 눌러서 프로젝트 생성 후 브랜치 설정

2. 생성된 프로젝트 세팅에 들어가서 브랜치 변경
   Project Settings -> Environments -> Production

   Branch Tracking에서 브랜치 develop으로 변경

   <img src="https://github.com/user-attachments/assets/40d47e04-f6c0-4935-b0ba-9909b857add7" alt="Image" style="zoom: 50%;" />

3. 루트 디렉토리 작성
   본 프로젝트는 FE/Keywi 폴더가 프론트 프로젝트 폴더이기 때문에 Root Directory에 `FE/keywi/` 작성
   <img src="https://github.com/user-attachments/assets/0d3f86ba-17eb-4348-adf2-45f981b92eca" alt="Image" style="zoom:67%;" />

4. Jenkins에서 수동 빌드해서 트리거 걸어보기
   <img src="https://github.com/user-attachments/assets/d6c9307d-7180-491d-9f4e-c21a004b4eee" alt="Image" style="zoom: 50%;" />

   <img src="https://github.com/user-attachments/assets/78cd820e-ac4d-4461-842a-08489ca3a375" alt="Image" style="zoom:50%;" />

   



