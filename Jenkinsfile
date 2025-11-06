pipeline {
    agent any

    environment {
        IMAGE_NAME = "vps-portal"
        IMAGE_TAG = "dev"
        DEV_SERVER = "10.69.69.81"
        SSH_CRED = "lubuntukey"  // Jenkins credential ID for SSH key or username/password
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('vps-app') {
                    script {
                        sh """
                        echo "Building Docker image..."
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                        """
                    }
                }
            }
        }

        stage('Deploy to Dev Server') {
            steps {
                script {
                    echo "Deploying Docker container to Dev Server..."
                    sshagent (credentials: ["${SSH_CRED}"]) {
                        sh """
                        scp -o StrictHostKeyChecking=no $(docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > /tmp/${IMAGE_NAME}.tar.gz) ${DEV_SERVER}:/tmp/
                        ssh -o StrictHostKeyChecking=no ${DEV_SERVER} 'docker load < /tmp/${IMAGE_NAME}.tar.gz'
                        ssh -o StrictHostKeyChecking=no ${DEV_SERVER} '
                            docker stop ${IMAGE_NAME} || true &&
                            docker rm ${IMAGE_NAME} || true &&
                            docker run -d --name ${IMAGE_NAME} -p 80:80 ${IMAGE_NAME}:${IMAGE_TAG}
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Dev deployment successful at http://${DEV_SERVER}"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
