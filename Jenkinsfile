pipeline {
    agent { label 'lbuubntu' }

    environment {
        APP_NAME = "devops-frontend"
        IMAGE_TAG = "latest"
        DEV_SERVER = "10.69.69.81"
        HOST_PORT = "8080"
        NVM_DIR = "${WORKSPACE}/.nvm"
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
                echo "🟢 Installing Node.js 20 via NVM..."
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

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh '''
                    if ! command -v docker &>/dev/null; then
                        echo "❌ Docker not installed or not accessible on Jenkins agent!"
                        exit 1
                    fi

                    echo "✅ Docker is available."
                    cat > Dockerfile <<'EOF'
                    FROM node:20-alpine AS build
                    WORKDIR /app
                    COPY vps-app/package*.json ./
                    RUN npm install
                    COPY vps-app/ .
                    RUN npm run build

                    FROM nginx:alpine
                    COPY --from=build /app/dist /usr/share/nginx/html
                    EXPOSE 80
                    CMD ["nginx", "-g", "daemon off;"]
                    EOF

                    echo "🚧 Building image ${APP_NAME}:${IMAGE_TAG}..."
                    docker build -t ${APP_NAME}:${IMAGE_TAG} .
                    docker images | grep ${APP_NAME} || (echo "❌ Docker image not found after build!" && exit 1)
                '''
            }
        }

        stage('Deploy to Dev Server') {
            steps {
                echo "🚀 Deploying to Dev Server (${DEV_SERVER})..."
                sshagent (credentials: ['lubuntukey']) {
                    sh '''
                        echo "📦 Exporting Docker image and sending to dev server..."
                        docker save ${APP_NAME}:${IMAGE_TAG} | bzip2 | ssh -o StrictHostKeyChecking=no root@${DEV_SERVER} 'bunzip2 | docker load'

                        echo "♻️ Restarting container on dev server..."
                        ssh -o StrictHostKeyChecking=no root@${DEV_SERVER} "
                            docker stop ${APP_NAME} || true
                            docker rm ${APP_NAME} || true
                            docker run -d --name ${APP_NAME} -p ${HOST_PORT}:80 ${APP_NAME}:${IMAGE_TAG}
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Successfully deployed to Dev (${DEV_SERVER})!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
