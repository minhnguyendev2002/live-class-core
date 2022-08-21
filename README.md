<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# **Big City App (Live class - Mega Microservice)**




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

