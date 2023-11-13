pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checks out the source code from your repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install project dependencies, including Playwright
                sh 'npm install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                // Run your Playwright tests
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Collect results, artifacts, or perform cleanup
            echo 'Test execution completed'
        }

        success {
            // Actions to perform on successful completion
            echo 'Tests passed successfully!'
        }

        failure {
            // Actions to perform if the pipeline fails
            echo 'Tests failed. Check logs for details.'
        }
    }
}
