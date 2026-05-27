pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint & Format Check') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Vercel') {
            steps {
                // Requires VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID 
                // to be configured as secrets in Jenkins.
                withCredentials([
                    string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
                    string(credentialsId: 'vercel-org-id', variable: 'VERCEL_ORG_ID'),
                    string(credentialsId: 'vercel-project-id', variable: 'VERCEL_PROJECT_ID')
                ]) {
                    sh 'npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN'
                    sh 'npx vercel build --prod --token=$VERCEL_TOKEN'
                    sh 'npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN'
                }
            }
        }
    }

    post {
        always {
            echo 'Frontend Build completed.'
        }
        success {
            echo 'Frontend Pipeline succeeded!'
        }
        failure {
            echo 'Frontend Pipeline failed!'
        }
    }
}
