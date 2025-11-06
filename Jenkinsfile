/**
 * Declarative Jenkins Pipeline for a React (Vite) Application
 *
 * This pipeline:
 * 1. Checks out the code from your Git repository.
 * 2. Installs Node.js dependencies using npm.
 * 3. Builds the production-ready static files (`npm run build`).
 * 4. Deploys these static files to your dev server via SSH.
 */
pipeline {
    // 1. Agent Configuration
    // Use any available Jenkins agent.
    // For a more robust setup, you could use a Docker agent
    // with a specific Node.js image, e.g.: agent { docker { image 'node:18' } }
    agent any

    // 2. Tools
    // Assumes you have Node.js configured in Jenkins Global Tool Configuration
    // with the name 'nodejs-18'.
    tools {
        nodejs 'nodejs-18' 
    }

    // 3. Environment Variables
    // Define variables used in the pipeline.
    environment {
        // --- !! IMPORTANT: SET THESE VARIABLES !! ---
        
        // Jenkins Credential ID for your dev server's SSH key or user/pass.
        // Go to Jenkins > Manage Jenkins > Credentials > System > Global credentials.
        // Add your server's SSH credentials and get the ID.
        SSH_CREDENTIALS_ID = 'dev-server-creds'
        
        // SSH user for the dev server (e.g., 'ubuntu', 'root', 'sovan')
        SERVER_USER = 'ubuntu'
        
        // Target IP (as requested)
        SERVER_IP = '10.69.69.81'
        
        // The *full path* on your server where the website files should go.
        // Example: '/var/www/html/vps-portal' or '/home/ubuntu/my-app'
        TARGET_DIR = '/var/www/vps-portal'
    }

    // 4. Pipeline Stages
    stages {
        // --- STAGE 1: CHECKOUT ---
        // Clones the Git repository.
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                // 'checkout scm' automatically checks out the branch
                // for the pipeline (e.g., 'main', 'devops', 'vpsplatform').
                checkout scm
            }
        }

        // --- STAGE 2: INSTALL DEPENDENCIES ---
        // Runs 'npm install' to get all packages.
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                // 'npm ci' is often preferred in CI for faster, more reliable builds.
                // Using 'npm install' is also fine.
                sh 'npm ci'
            }
        }

        // --- STAGE 3: BUILD PROJECT ---
        // Runs 'npm run build' to create the 'dist' folder.
        stage('Build') {
            steps {
                echo 'Building React application...'
                // This executes the "build" script from your package.json
                sh 'npm run build'
            }
        }

        // --- STAGE 4: DEPLOY TO DEV SERVER ---
        // Copies the 'dist' folder contents to the server at 10.69.69.81.
        stage('Deploy to Dev') {
            steps {
                echo "Deploying build to ${SERVER_USER}@${SERVER_IP}..."
                
                // Use the 'ssh-agent' wrapper to handle SSH authentication
                // using the credentials stored in Jenkins.
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    // We use 'sh' to run shell commands. The ''' quotes
                    // allow us to write a multi-line script.
                    sh '''
                        # First, make sure the target directory exists on the server.
                        # The '-p' flag creates parent directories if they don't exist.
                        # We use '-o StrictHostKeyChecking=no' to auto-accept the server's key.
                        ssh -o StrictHostKeyChecking=no ${env.SERVER_USER}@${env.SERVER_IP} "mkdir -p ${env.TARGET_DIR}"

                        # Second, use 'scp' (Secure Copy) to transfer the files.
                        # '-r' means 'recursive' (copy the whole folder).
                        # We copy the *contents* of the 'dist' folder (dist/*)
                        # into the target directory on the server.
                        scp -r -o StrictHostKeyChecking=no dist/* ${env.SERVER_USER}@${env.SERVER_IP}:${env.TARGET_DIR}/
                    '''
                }
                echo 'Deployment complete.'
            }
        }
    }
    
    // 5. Post-Build Actions
    // Runs after all stages, regardless of success or failure.
    post {
        always {
            echo 'Pipeline finished.'
            // Clean up the workspace to save disk space
            cleanWs()
        }
    }
}
