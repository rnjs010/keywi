# 인프라 설계
## Jenkins 초기 세팅
![Image](https://github.com/user-attachments/assets/36e65e2c-2831-43ca-ac57-adf94485ba9e)

0. Jira/Gitlab/Docker Credential 발급
1. Jenkins 서버에 접속하여 MM 알림용 Item 생성
2. MM에서 알림을 받을 채널 WebHook 만들기
![Image](https://github.com/user-attachments/assets/d7c51e82-5112-4a70-8220-d0a9d4912ddf)
3. GitLab WebHook 만들기
![Image](https://github.com/user-attachments/assets/bb7906c1-86b4-4cf9-b69e-e27a27bb77dc)
4. MM 알림용 Item 내 설정

### Jenkins 파이프라인 스크립트 작성
```Groovy
import groovy.json.JsonSlurper  // Groovy의 JSON 파싱 라이브러리 임포트

// Jenkins 파이프라인 정의 시작
pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능하도록 설정
    tools {
        jdk 'Zulu17'  // JDK 17 사용 
        git 'Default Git'  // 기본 Git 도구 사용
    }
    environment {
        // 파이프라인에서 사용할 환경 변수 정의
        GIT_COMMIT_MESSAGE = ''  // 커밋 메시지 저장용
        TIMESTAMP = ''  // 커밋 타임스탬프 저장용
        AUTHOR = ''  // 커밋 작성자 저장용
        ISSUE_KEY = ''  // Jira 이슈 키 저장용
        JIRA_LINK = ''  // Jira 이슈 링크 저장용
        CLEANED_MESSAGE = ''  // 이슈 키를 제거한 커밋 메시지
        JIRA_ISSUE_SUMMARY = ''  // Jira 이슈 요약 저장용
        JIRA_BASE_URL = 'https://ssafy.atlassian.net'  // Jira 기본 URL
        GITLAB_BASE_URL = "https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21E202"  // GitLab 프로젝트 URL
        BRANCH_NAME = ''  // 브랜치 이름 저장용
        COMMIT_HASH = ''  // 커밋 해시 저장용
    }
    stages {
        // 1단계: 저장소 체크아웃 및 업데이트
        stage('Checkout and Update') {
            steps {
                script {
                    def repoExists = fileExists('.git')  // 이미 저장소가 클론되어 있는지 확인
                    if (repoExists) {
                        echo "Repository exists. Updating..."  // 저장소가 존재하면 업데이트
                        try {
                            // Git SCM으로 develop 브랜치 체크아웃
                            checkout([
                                $class: 'GitSCM',
                                branches: [[name: '*/develop']],
                                userRemoteConfigs: [[
                                    url: "${GITLAB_BASE_URL}.git",
                                    credentialsId: 'gitlab-credentials'  // GitLab 접근 인증정보
                                ]],
                                extensions: [
                                    [$class: 'CleanBeforeCheckout'],  // 체크아웃 전 클린 작업
                                    [$class: 'PruneStaleBranch']  // 오래된 브랜치 제거
                                ]
                            ])
                            
                            // GitLab 인증정보를 사용하여 저장소 동기화
                            withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials', gitToolName: 'git-tool')]) {
                                // 모든 리모트 브랜치 정보 갱신 및 정리
                                sh """
                                    git fetch --all --prune  // 모든 리모트 데이터 가져오기 및 오래된 레퍼런스 제거
                                    git remote update --prune  // 리모트 정보 업데이트 및 정리
                                    git gc --prune=now  // Git 가비지 컬렉션 수행하여 저장소 최적화
                                """
                                
                                // 가장 최근에 커밋된 브랜치 찾기
                                BRANCH_NAME = sh(script: """
                                    git ls-remote --sort=-committerdate origin 'refs/heads/*' |  // 커밋 날짜 기준 정렬된 브랜치 목록
                                    awk -F'/' '{print substr(\$0, index(\$0,\$3))}' |  // 브랜치 이름 추출
                                    head -n 1  // 첫 번째(가장 최근) 브랜치 선택
                                """, returnStdout: true).trim()
                                echo BRANCH_NAME
                                
                                // 최신 브랜치로 체크아웃 (충돌 시 develop으로 폴백)
                                sh """
                                    git checkout -B ${BRANCH_NAME} origin/${BRANCH_NAME} --force ||  // 강제로 해당 브랜치 체크아웃
                                    { git checkout develop && git reset --hard origin/develop; }  // 실패시 develop으로 폴백
                                """
                            }
                        } catch (Exception e) {
                            echo "Error during checkout and update: ${e.message}"
                            error "체크아웃에 실패했습니다.: ${e.message}"  // 에러 메시지 출력 및 실패 처리
                        }
                    } else {
                        echo "Repository does not exist. Cloning..."  // 저장소가 없으면 새로 클론
                        try {
                            withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials', gitToolName: 'git-tool')]) {
                                sh "git clone ${GITLAB_BASE_URL}.git ."  // 저장소 클론
                                sh "git checkout develop"  // develop 브랜치로 전환
                                
                                // 저장소 동기화 및 정리
                                sh """
                                    git fetch --all --prune
                                    git remote update --prune
                                    git gc --prune=now
                                """
                                
                                // 가장 최근 브랜치 찾기
                                BRANCH_NAME = sh(script: """
                                    git ls-remote --sort=-committerdate origin 'refs/heads/*' |
                                    awk -F'/' '{print substr(\$0, index(\$0,\$3))}' |
                                    head -n 1
                                """, returnStdout: true).trim()
                                echo "Latest branch: ${BRANCH_NAME}"
                                
                                // 최신 브랜치로 체크아웃
                                sh "git checkout -B ${BRANCH_NAME} origin/${BRANCH_NAME} --force"
                            }
                        } catch (Exception e) {
                            echo "Error during clone: ${e.message}"
                            error "Failed to clone repository"  // 클론 실패 시 오류 처리
                        }
                    }
                }
            }
        }
        // 2단계: 최신 커밋의 메시지와 시간 정보 가져오기
        stage('Fetch Commit Message and Timestamp') {
            steps {
                script {
                    // 최신 커밋 메시지 추출
                    GIT_COMMIT_MESSAGE = sh(
                        script: "git log -1 --pretty=format:%s",  // 가장 최근 커밋의 제목만 가져옴
                        returnStdout: true
                    ).trim()
                    echo "Fetched Commit Message: ${GIT_COMMIT_MESSAGE}"

                    // 커밋 작성자 추출
                    AUTHOR = sh(
                        script: "git log -1 --pretty=format:%an",  // 가장 최근 커밋의 작성자 이름
                        returnStdout: true
                    ).trim()
                    echo "Commit Author: ${AUTHOR}"
                    
                    // 커밋 타임스탬프 추출
                    TIMESTAMP = sh(
                        script: "git log -1 --pretty=format:%ad --date=format:'%Y-%m-%d %H:%M:%S'",  // 날짜 포맷팅
                        returnStdout: true
                    ).trim()
                    echo "Timestamp: ${TIMESTAMP}"
                    
                    // 커밋 해시 추출
                    COMMIT_HASH = sh(
                        script: "git log -1 --pretty=format:%H",  // 전체 해시값
                        returnStdout: true
                    ).trim()
                    echo "HASH: ${COMMIT_HASH}"
                }
            }
        }
        // 3단계: Jira 이슈 키 추출
        stage('Extract Jira Issue Key') {
            steps {
                script {
                    // 커밋 메시지에서 Jira 이슈 키 패턴 찾기 (예: [#S12P21E202-123])
                    def issueKeyPattern = /\[#(S12P21E202-\d+)]/
                    def matcher = GIT_COMMIT_MESSAGE =~ issueKeyPattern
                    
                    if (matcher) {
                        // 이슈 키를 찾으면 저장하고 Jira 링크 생성
                        ISSUE_KEY = matcher[0][1]  // 첫 번째 매칭 그룹(이슈 키)
                        JIRA_LINK = "${JIRA_BASE_URL}/jira/software/c/projects/S12P21E202/boards/7980?selectedIssue=${ISSUE_KEY}"
        
                        // 이슈 키를 제거한 커밋 메시지 저장
                        CLEANED_MESSAGE = GIT_COMMIT_MESSAGE.replaceFirst(issueKeyPattern, '').trim()
                    } else {
                        echo "No Jira Issue Key found in the commit message."
                        CLEANED_MESSAGE = GIT_COMMIT_MESSAGE  // 이슈 키가 없으면 원본 메시지 사용
                        echo CLEANED_MESSAGE
                    }
                }
            }
        }
        // 4단계: Jira API를 통해 이슈 요약 정보 가져오기
        stage('Fetch Jira Issue Summary') {
            steps {
                script {
                    try{
                        // Jira 인증정보를 사용하여 API 호출
                        withCredentials([usernamePassword(credentialsId: 'jira-credentials', usernameVariable: 'JIRA_USER', passwordVariable: 'JIRA_TOKEN')]) {
                            def response = sh(
                                script: """
                                    curl -s -u "\$JIRA_USER:\$JIRA_TOKEN" \\
                                    -H "Content-Type: application/json" \\
                                    "${JIRA_BASE_URL}/rest/api/2/issue/${ISSUE_KEY}?fields=summary"  // 이슈 요약만 요청
                                """,
                                returnStdout: true
                            ).trim()
                            
                            // JSON 응답 파싱
                            def jsonSlurper = new JsonSlurper()
                            def result = jsonSlurper.parseText(response)
                            JIRA_ISSUE_SUMMARY = result.fields.summary  // 이슈 요약 추출
                            echo "Jira Issue Summary: ${JIRA_ISSUE_SUMMARY}"
                        }
                    } catch (Exception e) {
                        echo "Error fetching Jira issue summary: ${e.message}"
                        JIRA_ISSUE_SUMMARY = "Error fetching issue summary"  // 오류 시 기본값 설정
                        echo JIRA_ISSUE_SUMMARY
                    }
                }
            }
        }
        // 5단계: Mattermost로 알림 전송
        stage('Notify Mattermost') {
            steps {
                script {
                    try{
                        // 알림 메시지 구성
                        def message = "Gitlab_Check - #${env.BUILD_NUMBER} Changes:\n" +
                            "- Changes on branch [${BRANCH_NAME}](${GITLAB_BASE_URL}/-/tree/${BRANCH_NAME}):\n" +
                            (ISSUE_KEY ? "  - ISSUE : [${JIRA_ISSUE_SUMMARY ?: 'Jira'}](${JIRA_LINK})\n" : "  - Can't find issue key\n") +
                            (ISSUE_KEY ? "  - [${ISSUE_KEY}] " : "  - ") +
                            "[${CLEANED_MESSAGE}](${GITLAB_BASE_URL}/-/commit/${COMMIT_HASH}) [${AUTHOR}]\n\n\n" +
                            "`${TIMESTAMP}`"
                        
                        // Mattermost에 성공 알림 전송 (녹색)
                        mattermostSend color: 'good', message: message
                    } catch (Exception e) {
                        echo e.message
                        // 오류 발생 시 대체 메시지 생성
                        def message = "Gitlab_Check - #${env.BUILD_NUMBER} Changes:\n" +
                            "- Changes on branch [${BRANCH_NAME}](${GITLAB_BASE_URL}/-/tree/${BRANCH_NAME}):\n" +
                            "  - Can't find issue key\n" +
                            "  - [${CLEANED_MESSAGE}](${GITLAB_BASE_URL}/-/commit/${COMMIT_HASH}) [${AUTHOR}]\n\n\n" +
                            "`${TIMESTAMP}`"
                        
                        // Mattermost에 경고 알림 전송 (노란색)
                        mattermostSend color: 'warning', message: message
                    }
                    
                }
            }
        }
    }
    // 파이프라인 실행 후 작업
    post {
        failure {
            script {
                // 파이프라인 실패 시 오류 메시지 구성
                def message = "Gitlab_Check - #${env.BUILD_NUMBER} Failed:\n" +
                    "- 파이프라인 실행 중 오류가 발생했습니다.\n" +
                    "- 브랜치가 삭제되었거나 저장소에 문제가 있을 수 있습니다.\n" +
                    "- 저장소를 확인하고 로컬 브랜치를 업데이트해 주세요.\n\n" +
                    "`${new Date().format("yyyy-MM-dd HH:mm:ss")}`"
                
                // Mattermost에 실패 알림 전송 (빨간색)
                mattermostSend color: 'danger', message: message
            }
        }
        always {
            echo "Pipeline completed."  // 항상 실행되는 완료 메시지
        }
    }
}

```