pipeline {
    agent any

    environment {
        GOREST_API_TOKEN = credentials('gorest-api-token')
        BASE_URL = 'https://gorest.co.in/public/v2'
    }

    tools {
        // Make sure 'NodeJS' matches the name of the Node.js installation
        // configured in your Jenkins Global Tool Configuration
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checks out the source code from the Git repository
                checkout scm
            }
        }

        stage('Load Environment Variables') {
            steps {
                // Load environment variables from .env file
                sh 'bash -c "source load_env.sh"'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies, including Playwright
                sh 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // Install Playwright browsers
                sh 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                // Run Playwright tests
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Publish JUnit test results
            junit '**/test-results/*.xml'
            // Actions to perform after the pipeline execution, regardless of the result
            echo 'Pipeline execution is complete.'
        }

        success {
            // Actions to perform if the pipeline succeeds
            echo 'Pipeline succeeded!'
        }

        failure {
            // Actions to perform if the pipeline fails
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
