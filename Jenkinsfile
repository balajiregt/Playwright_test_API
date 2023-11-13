pipeline {
    agent any
    environment {
        BASE_URL = 'https://gorest.co.in/public/v2'
        // The API token will be loaded from Jenkins credentials
        GOREST_API_TOKEN = credentials('token')
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

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies, including Playwright
                sh 'npm install'
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
