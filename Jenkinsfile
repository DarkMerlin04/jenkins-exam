pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {
        stage("VM1: Clear Docker Con & Img if Exist") {
            agent {
                label 'master'
            }
            steps {
                script {
                    // Stop and remove all running containers
                    def runningContainers = sh(script: 'docker ps -q | wc -l', returnStdout: true).trim().toInteger()
                    if (runningContainers > 0) {
                        sh 'docker stop $(docker ps -a -q)'
                        sh 'docker rm $(docker ps -a -q)'
                    } else {
                        echo "No running containers to stop."
                    }

                    // Remove all Docker images
                    def dockerImages = sh(script: 'docker images -q | wc -l', returnStdout: true).trim().toInteger()
                    if (dockerImages > 0) {
                        sh 'docker rmi -f $(docker images -q)'
                    } else {
                        echo "No Docker images to remove."
                    }
                }
            }
        }

        stage("VM1: Install Node Packages") {
            agent {
                label 'master'
            }
            steps {
                echo 'Installing Packages'
                sh 'npm install'
            }
        }

        stage("VM1: Unit Test") {
            agent {
                label 'master'
            }
            steps {
                echo 'Run Unit Test'
                sh 'npm run test'
            }
        }

        stage("VM1: Docker API UP"){
            agent {
                label 'master'
            }
            steps {
                echo 'Docker Build API UP'
                sh 'docker build -t jenkins-exam .'
                sh 'docker run -d -p 5000:5000 jenkins-exam'
                sh 'docker ps'
            }
        }

        stage("VM1: Run Robot") {
            agent {
                label 'master'
            }
            steps {
                echo 'Clone Robot'
                dir('./robot/') {
                    git branch: 'main', url: 'https://github.com/softdev-lab/jenkins-robot.git'
                }
                echo 'Run Robot'
                sh 'cd ./robot && python3 -m robot ./jenkins-test.robot'
            }
        }

        stage("VM1: Build & Push to Registry") {
            agent {
                label 'master'
            }
            steps {
                echo 'Build & Push'
                withCredentials([
                    usernamePassword(credentialsId: 'vm2version2', usernameVariable: 'DEPLOY_USER', passwordVariable: 'DEPLOY_TOKEN')
                ]) {
                    sh "docker login registry.gitlab.com -u ${DEPLOY_USER} -p ${DEPLOY_TOKEN}"
                }
                sh "docker build -t registry.gitlab.com/ajdvdsf.aj/jenkins-assignment ."
                sh "docker push registry.gitlab.com/ajdvdsf.aj/jenkins-assignment"
                echo 'Build & Push Success!'
            }
        }

        stage("VM1: Clear everything in docker") {
            agent {
                label 'master'
            }
            steps {
                echo 'Cleaning'
                sh 'docker stop $(docker ps -a -q)'
                sh 'docker system prune -a -f'
            }
        }

        stage("VM2: Run API from Image Registry") {
            agent {
                label 'preprod'
            }
            steps {
                sh 'docker stop $(docker ps -a -q)'
                sh 'docker system prune -a -f'
                sh 'docker-compose up -d --build'
                echo 'API Successfully Running'
            }
        }
    }
}