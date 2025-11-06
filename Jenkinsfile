pipeline {
    agent { label 'lbuubntu' }

    environment {
        APP_NAME = "devops-frontend"
        IMAGE_TAG = "latest"
        DEV_SERVER = "10.69.69.81"
        HOST_PORT = "8080"
        NVM_DIR = "${WORKSPACE}/.nvm"
        REMOTE_PATH = "/root/devops-build"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out code..."
                checkout scm
            }
        }

        stage('Setup Node 20') {
            steps {
                echo "🟢 Installing Node.js 20 using NVM..."
                sh '''
                    export NVM_DIR=${NVM_DIR}
                    mkdir -p $NVM_DIR
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                    . "$NVM_DIR/nvm.sh"
                    nvm install 20
                    nvm use 20
                    node -v
                    npm -v
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                dir('vps-app') {
                    echo "🏗️ Building Vite React app..."
                    sh '''
                        export NVM_DIR=${NVM_DIR}
                        . "$NVM_DIR/nvm.sh"
                        nvm use 20
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Send Build to Dev Server') {
            steps {
                sshagent (credentials: ['lubuntukey']) {
                    echo "📦 Sending build files to Dev Server (${DEV_SERVER})..."
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@${DEV_SERVER} "rm -rf ${REMOTE_PATH} && mkdir -p ${REMOTE_PATH}"
                        scp -o StrictHostKeyChecking=no -r vps-app/dist root@${DEV_SERVER}:${REMOTE_PATH}/
                    '''
                }
            }
        }

        stage('Build & Deploy Docker on Dev Server') {
            steps {
                sshagent (credentials: ['lubuntukey']) {
                    echo "🐳 Building Docker image on Dev Server..."
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@${DEV_SERVER} "
                            cd ${REMOTE_PATH} &&
                            printf 'FROM nginx:alpine\\nCOPY dist /usr/share/nginx/html\\nEXPOSE 80\\nCMD [\\"nginx\\", \\"-g\\", \\"daemon off;\\"]\\n' > Dockerfile &&
                            docker build -t ${APP_NAME}:${IMAGE_TAG} . &&
                            docker stop ${APP_NAME} || true &&
                            docker rm ${APP_NAME} || true &&
                            docker run -d --name ${APP_NAME} -p ${HOST_PORT}:80 ${APP_NAME}:${IMAGE_TAG} &&
                            sleep 3 &&
                            docker ps --filter name=${APP_NAME}
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Successfully deployed on Dev Server (${DEV_SERVER})!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
