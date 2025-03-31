import groovy.json.JsonOutput


pipeline {
    agent any
    tools {
        maven 'Default Maven'
        jdk 'Zulu17'
        git 'Default Git'
    }
    parameters {
        string(name: 'GIT_COMMIT', defaultValue: '')
        string(name: 'GIT_BRANCH', defaultValue: '')
    }
    environment {
        STAGE_NAME = ''
        
        // Docker 설정
        DOCKER_USER = 'team2room'
        IMAGE_NAME = 'keywi'
        GIT_COMMIT_SHORT = ''
        DOCKER_TAG = ''
        
        // 깃 정보
        COMMIT_MSG = ''
        COMMIT_HASH = ''
        AUTHOR = ''
        BRANCH_NAME = ''
        SERVICE_PATH = ''
        SERVICES = ''
        ERROR_MSG = "false"
        
        // 서버 정보
        // TEST_SERVER = 'ssafy-gcloudtest.kro.kr'
        PROD_SERVER = 'j12e202.p.ssafy.io'
        JIRA_BASE_URL = 'https://ssafy.atlassian.net'
        GITLAB_BASE_URL = 'https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21E202'
    }
    stages {
        stage('Checkout and Update') {
            steps {
                script {
                    STAGE_NAME = "Checkout and Update (1/6)"
                    def repoExists = fileExists('.git')
                    if (repoExists) {
                        echo "Repository exists. Updating..."
                        try {
                            checkout([
                                $class: 'GitSCM',
                                branches: [[name: '*/develop']],
                                userRemoteConfigs: [[
                                    url: "${GITLAB_BASE_URL}.git",
                                    credentialsId: 'gitlab-credentials'
                                ]],
                                extensions: [
                                    [$class: 'CleanBeforeCheckout'],
                                    [$class: 'PruneStaleBranch'],
                                    [$class: 'CloneOption', depth: 0, shallow: false]
                                ]
                            ])
                            withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials')]) {
                                sh """
                                    git fetch --all --prune
                                """
                                
                                BRANCH_NAME = params.GIT_BRANCH ?: sh(script: """
                                    git name-rev --name-only ${params.GIT_COMMIT} |
                                    sed 's/^origin\\///;s/\\^0$//'
                                """, returnStdout: true).trim()
                                echo "Target branch: ${BRANCH_NAME}"
                                sh "git checkout ${BRANCH_NAME}"
                                
                                GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                                DOCKER_TAG = "${env.BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
                                
                                // MSA 서비스 경로 설정
                                SERVICE_PATH = BRANCH_NAME.contains('feature/BE/') ? BRANCH_NAME.replace("feature/BE/", "") : ""
                                
                                // 서비스 목록 설정
                                // if (BRANCH_NAME == "develop") {
                                //     SERVICES = "config,eureka,gateway,auth,common,feed,product,payment,search,chat,notification"
                                // } else
                                if (BRANCH_NAME == "feature/BE/gateway") {
                                    SERVICES = "eureka,gateway"
                                } else {
                                    SERVICES = "${SERVICE_PATH}"
                                }
                            
                                echo "branch: ${BRANCH_NAME}"
                                echo "services to build: ${SERVICES}"
                                echo "docker tag: ${DOCKER_TAG}"
                            }
                        } catch (Exception e) {
                            echo "Error during update: ${e.message}"
                            ERROR_MSG = "Failed to update repository"
                            error ERROR_MSG
                        }
                    } else {
                        echo "Repository does not exist. Cloning..."
                        try {
                            withCredentials([gitUsernamePassword(credentialsId: 'gitlab-credentials')]) {
                                sh "git clone ${GITLAB_BASE_URL}.git ."
                                
                                BRANCH_NAME = params.GIT_BRANCH ?: sh(script: """
                                    git name-rev --name-only ${params.GIT_COMMIT} |
                                    sed 's/^origin\\///;s/\\^0$//'
                                """, returnStdout: true).trim()
                                echo "Latest branch: ${BRANCH_NAME}"

                                sh "git checkout ${BRANCH_NAME}"

                                GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                                DOCKER_TAG = "${env.BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
                                
                                // MSA 서비스 경로 설정
                                SERVICE_PATH = BRANCH_NAME.replace("feature/BE/", "")
                                
                                // 서비스 목록 설정
                                if (BRANCH_NAME == "feature/BE/gateway") {
                                    SERVICES = "gateway,eureka"
                                } else {
                                    SERVICES = "${SERVICE_PATH}"
                                }
                                
                                echo "branch: ${BRANCH_NAME}"
                                echo "services to build: ${SERVICES}"
                                echo "docker tag: ${DOCKER_TAG}"
                            }
                        } catch (Exception e) {
                            echo "Error during clone: ${e.message}"
                            ERROR_MSG = "Failed to clone repository"
                            error ERROR_MSG
                        }
                    }
                    AUTHOR = sh(script: "git log -1 --pretty=format:%an", returnStdout: true).trim()
                    COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    COMMIT_HASH = sh(script: "git log -1 --pretty=format:%H", returnStdout: true).trim()
                }
                script {
                    if (sh(
                        script: "git ls-tree -d origin/${BRANCH_NAME} BE", 
                        returnStatus: true
                    ) != 0) {
                        currentBuild.result = 'ABORTED'
                        ERROR_MSG = "BE 디렉토리가 원격 브랜치에 존재하지 않음"
                        error ERROR_MSG
                    }
                    
                    if (!fileExists("BE")) {
                        ERROR_MSG = "BE 디렉토리가 로컬에 존재하지 않음"
                        error ERROR_MSG
                    }
                    
                    if (COMMIT_MSG.toLowerCase().contains('[fe]')) {
                        ERROR_MSG = "FE 커밋으로 빌드 중단"
                        error ERROR_MSG
                    }
                }
            }
        }
        stage('Inject Config') {
            steps {
                script {
                    def servicesList = SERVICES.split(',')
                    STAGE_NAME = "Inject Config (2/6)"
                    
                    servicesList.each { SERVICE ->
                        echo "Injecting config for ${SERVICE}..."
                        
                        if (SERVICE == "config") {
                            withCredentials([
                                file(credentialsId: 'config_yml', variable: 'CONFIG_FILE')
                            ]) {
                                sh """
                                    mkdir -p BE/${SERVICE}/src/main/resources
                                    cp \$CONFIG_FILE BE/${SERVICE}/src/main/resources/application.yml
                                """
                            }
                        }
                    }
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    STAGE_NAME = "Build (3/6)"
                    def servicesList = SERVICES.split(',')
                    servicesList.each { SERVICE ->
                        echo "Building ${SERVICE}..."
                        dir("BE/${SERVICE}") {
                            try {
                                // Maven 빌드 사용
                                sh "mvn clean package -DskipTests"
                            } catch(Exception e) {
                                ERROR_MSG = e.getMessage()
                                error "Build failed for ${SERVICE}: ${ERROR_MSG}"
                            }
                        }
                    }
                }
            }
            post {
                failure {
                    cleanWs()
                    script {
                        ERROR_MSG += "\nBuild failed"
                        error ERROR_MSG
                    }
                }
            }
        }
        stage('Docker Build') {
            steps {
                script {
                    STAGE_NAME = "Docker Build (4/6)"
                    def servicesList = SERVICES.split(',')
                    servicesList.each { SERVICE ->
                        echo "Docker building ${SERVICE}..."
                        def jarFile = sh(script: "ls BE/${SERVICE}/target/*.jar", returnStdout: true).trim()
                        
                        try {
                            // docker.build("${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:${DOCKER_TAG}-test", 
                            //     "--no-cache --build-arg JAR_FILE=${jarFile} -f BE/${SERVICE}/Dockerfile .")
                            
                            docker.build("${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:${DOCKER_TAG}", 
                                "--no-cache --build-arg JAR_FILE=${jarFile} -f BE/${SERVICE}/Dockerfile .")
                            sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:${DOCKER_TAG} ${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:latest"
                            // sh "docker save ${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:${DOCKER_TAG}-test | gzip > ${SERVICE}-image.tar.gz"
                        } catch(Exception e) {
                            ERROR_MSG = e.getMessage()
                            error "Docker build failed for ${SERVICE}: ${ERROR_MSG}"
                        }
                    }
                }
            }
            post {
                failure {
                    cleanWs()
                    script {
                        ERROR_MSG += "\nDocker Build failed"
                        error ERROR_MSG
                    }
                }
            }
        }
        stage('Push to Docker Hub') {//('Deploy to Test') {
            steps {
                script {
                    STAGE_NAME = "Push to Docker Hub (5/6)"//"Deploy to Test (5/9)"
                    def servicesList = SERVICES.split(',')
                    servicesList.each { SERVICE ->
                        echo "Pushing ${SERVICE} to Docker Hub..."
                        
                        docker.withRegistry('https://index.docker.io/v1/', 'keywi-docker') {
                                docker.image("${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:${DOCKER_TAG}").push()
                        }
                        echo "Push ${SERVICE} Docker Image."
                    }
                }
            }
            post {
                failure {
                    cleanWs()
                    script {
                        ERROR_MSG = "Docker Push failed"
                        error ERROR_MSG
                    }
                }
            }
        }
        stage('Deploy to Prod') {
            steps {
                script {
                    STAGE_NAME = "Deploy to Prod (6/6)"
                    def servicesList = SERVICES.split(',')
                    servicesList.each { SERVICE ->
                        echo "Deploying ${SERVICE} to production server..."
                        def memoryl=""
                        if (SERVICE == 'search'){
                            memoryl = " --memory=4g --memory-swap=4g"
                        } else if (SERVICE == 'config'){
                            memoryl = " --memory=512m --memory-swap=512m"
                        } else if (SERVICE == 'auth'){
                            memoryl = " --memory=1g --memory-swap=1.5g"
                        }else {
                            memoryl = " --memory=768m --memory-swap=1g"
                        }
                        sshagent(['ec2-ssafy']) {
                            sh """
                                ssh -o StrictHostKeyChecking=no ubuntu@${PROD_SERVER} "
                                    docker pull ${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:${DOCKER_TAG}
                                    docker stop ${SERVICE} || true
                                    docker rm ${SERVICE} || true
                                    docker run${memoryl} --restart=unless-stopped -d --network host --name ${SERVICE} ${DOCKER_USER}/${IMAGE_NAME}-${SERVICE}:${DOCKER_TAG}
                                "
                            """
                        }
                    }
                    echo "Success Production deployment."
                }
            }
            post {
                failure {
                    script {
                        ERROR_MSG = "Production deployment failed"
                        error ERROR_MSG
                    }
                }
            }
        }
        // stage('Prod Health Check') {
        //     steps {
        //         script {
        //             STAGE_NAME = "Prod Health Check (8/9)"
        //             def maxRetries = 5
        //             def timeout = 10
                    
        //             SERVICES.each { SERVICE ->
        //                 def success = false
        //                 def port = SERVICE == "gateway" ? "8080" : (SERVICE == "eureka" ? "8761" : "8080")
                        
        //                 for (int i = 0; i < maxRetries; i++) {
        //                     sleep(timeout)
        //                     try {
        //                         def response = httpRequest "https://${PROD_SERVER}:${port}/actuator/health"
        //                         if (response.status == 200) {
        //                             success = true
        //                             break
        //                         }
        //                     } catch(e) {
        //                         echo "Health check attempt ${i+1} failed for ${SERVICE}"
        //                     }
        //                 }
                        
        //                 if (!success) {
        //                     ERROR_MSG = "Health check failed for ${SERVICE} after ${maxRetries} attempts"
        //                     error ERROR_MSG
        //                 }
        //             }
        //         }
        //     }
        // }
        stage('Complete') {
            steps {
                script {
                    STAGE_NAME = "Completed"
                }
            }
        }
    }
    post {
        always {
            script {
                def issueKeyPattern = /\[#(S12P21E202-\d+)]/
                def issueKey = (COMMIT_MSG =~ /S12P21E202-\d+/) ? (COMMIT_MSG =~ /S12P21E202-\d+/)[0] : null
                def cleanedMessage = issueKey ? COMMIT_MSG.replaceFirst(issueKeyPattern, '').trim() : COMMIT_MSG
                def jiraLink = issueKey ? "${JIRA_BASE_URL}/jira/software/c/projects/S12P21E202/boards/7980?selectedIssue=${issueKey}" : ''
                
                def message = "${env.JOB_NAME} - #${env.BUILD_NUMBER}\n" + "- 결과: " +
                              (cleanedMessage.toLowerCase().contains('[fe]') ? "STOP\n" : "${currentBuild.currentResult}\n") +
                              "- 브랜치: ${BRANCH_NAME}\n- 서비스: ${SERVICES}\n- 커밋: " +
                              (issueKey ? "[${issueKey}] " : "") +
                              "[${cleanedMessage}](${GITLAB_BASE_URL}/-/commit/${COMMIT_HASH}) (${GIT_COMMIT_SHORT}) [${AUTHOR}]\n" +
                              "- 실행 시간: ${currentBuild.durationString}\n" +
                              "- 최종 실행된 스테이지 : ${STAGE_NAME}\n" +
                              ((ERROR_MSG!="false") ? "- ERROR :\n`${ERROR_MSG}`\n" : "")
                
                if (issueKey) {
                    try {
                        def requestBody = [body: message]
                        def response = httpRequest authentication: 'jira-credentials',
                            contentType: 'APPLICATION_JSON',
                            httpMode: 'POST',
                            requestBody: groovy.json.JsonOutput.toJson(requestBody),
                            url: "${JIRA_BASE_URL}/rest/api/2/issue/${issueKey}/comment"
                        echo "JIRA comment added successfully. Status: ${response.status}"
                    } catch(e) {
                        echo "JIRA 코멘트 추가 실패: ${e.message}"
                    }
                }
                message += (currentBuild.currentResult == 'ABORTED' ? "- **사용자 취소**\n" : "")
                message += "- 상세: " + (currentBuild.currentResult == 'SUCCESS' ? ":jenkins7:" : (currentBuild.currentResult == 'ABORTED' ? ":jenkins_cute_flip:" : (cleanedMessage.toLowerCase().contains('[fe]') ? ":jenkins1:" : ":jenkins5:"))) + " [Jenkins](${env.BUILD_URL})"
                message += jiraLink ? " | :jira: [Jira](${jiraLink}) " : (cleanedMessage.contains('Merge') ? " | :jira6: [Jira](${JIRA_BASE_URL}/jira/software/c/projects/S12P21E202/boards/7980)" : " | :jira3:")
                message += "\n\n`${env.BUILD_TIMESTAMP}`"
                
                mattermostSend color: currentBuild.currentResult == 'SUCCESS' ? 'good' : (cleanedMessage.toLowerCase().contains('[fe]') ? 'good' : (currentBuild.currentResult == 'ABORTED' ? 'warning' : 'danger')), message: message
            }
        }
        failure {
            script {
                cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true)
            }
        }
    }
}
