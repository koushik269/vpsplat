pipeline {
    agent { label 'lbuubntu' }

    environment {
        APP_NAME = "devops-frontend"
        IMAGE_TAG = "latest"
        DEV_SERVER = "10.69.69.81"
        HOST_PORT = "8080"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out code..."
                checkout scm
            }
        }

        stage('Install Node 20') {
            steps {
                echo "🟢 Installing Node.js 20 on agent..."
                sh '''
                    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                    apt-get install -y nodejs
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

                    docker build -t ${APP_NAME}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Deploy to Dev Server') {
            steps {
                echo "🚀 Deploying to Dev Server (${DEV_SERVER})..."
                sshagent (credentials: ['lubuntukey']) {
                    sh '''
                        # Save image and send to dev server
                        docker save ${APP_NAME}:${IMAGE_TAG} | bzip2 | ssh -o StrictHostKeyChecking=no root@${DEV_SERVER} 'bunzip2 | docker load'

                        # Restart container
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
            echo "✅ Successfully deployed to Dev Server (${DEV_SERVER})!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
