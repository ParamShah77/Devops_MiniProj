pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Pulls the latest code triggered by the GitHub webhook
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // Triggers the SonarScanner tool configured in Jenkins
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('LocalSonarQube') {
                        if (isUnix()) {
                            sh "${scannerHome}/bin/sonar-scanner"
                        } else {
                            bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                        }
                    }
                }
            }
        }
    }
}
