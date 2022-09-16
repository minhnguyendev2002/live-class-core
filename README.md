<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# **Big City App (Live class - Mega Microservice)**

## .ENV:

|Key|Description|
|---|---|
|ENV|Runtime environment (development/staging/production)|
|LISTEN_PORT|3000|
|MYSQL_HOST|Mysql database's connection host|
|MYSQL_PORT|Mysql database's connection port|
|MYSQL_USERNAME|Mysql database's connection username|
|MYSQL_PASWORD|Mysql database's connection password|
|MYSQL_DATABASE|Mysql database's connection database name|
|REDIS_HOST|Redis connection host|
|REDIS_PORT|Redis connection host|
|RMQ_URL|Rabbitmq connection url|
|RMQ_QUEUE_NAME|Rabbitmq connection queue name|
|AGORA_APP_ID|Agora app id|
|AGORA_APP_CERTIFICATE|Agora app certificate|
|AGORA_APP_IDENTIFIER|Agora app identifer|
|AGORA_APP_AK|Agora app ak(for whiteboard)|
|AGORA_APP_SK|Agora app sk(for whiteboard)|

MONGO_HOST=222.252.26.132
MONGO_PORT=27017
MONGO_USERNAME=admin
MONGO_PASSWORD=PGc1oxYCyv073euppEmrpY5W5CYUNt

MONGO_CONNECTION_STRING=mongodb://admin:PGc1oxYCyv073euppEmrpY5W5CYUNt@222.252.26.132:27017/vmeet-dev?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Mysql typeorm migration
depend on your CLI manager, in this case I'm using **yarn** such as **npm** or **npx**
```bash
$ yarn typeorm:run 
```
_No need to run these commands in below_
```bash
$ yarn typeorm migration:generate -n update_v2
```
```bash
$ yarn typeorm migration:create -n update_v2
```
```bash
$ yarn typeorm:revert 
```
```bash
$ yarn typeorm:show 
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Dockerizing  

APIs service
```bash
# expose port 3000
$ docker build -t <IMAGE_NAME> .

```

Receiver service (socket)
```bash
# expose port 3101
$ docker build -f apps/receiver/Dockerfile -t <IMAGE_NAME> .

```

## Git  

- main
- master
- develop
- socket

