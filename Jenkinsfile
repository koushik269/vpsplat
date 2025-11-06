pipeline {
    agent any

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
                    FROM node:18-alpine AS build
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

                // Use Jenkins SSH credentials named 'lubuntukey'
                sshagent (credentials: ['lubuntukey']) {
                    sh '''
                        # Transfer docker image
                        docker save ${APP_NAME}:${IMAGE_TAG} | bzip2 | ssh -o StrictHostKeyChecking=no root@${DEV_SERVER} 'bunzip2 | docker load'

                        # Stop old container & start new one
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
