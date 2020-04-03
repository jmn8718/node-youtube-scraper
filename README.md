# node-youtube-scrapper

The goal of this project is to scrap youtube channel's page to get the latest video ids of a channel.

The [youtube API](https://developers.google.com/youtube/v3/docs) can be used to get the latest videos of a channel too.

## TODO

- [x] remove duplicated before check on db
- [x] Handle errors when page take more than 10s to load
- [X] Query youtube API to get videos data
- [ ] Handle youtube error response
- [x] Handle crawl results
- [ ] Handle api error response
- [x] write results to file
- [ ] Generate report from execution
- [x] Setup docker for DB testing purposes
- [ ] Setup API for testing videos crawl
- [ ] Setup API for user interaction
- [ ] Setup web ui for executions
- [ ] Save executions on DB

## Requirements

- nodejs
- mongodb
- youtube API key
- API token
- (_optional_) docker and docker-compose

## Database

The system uses mongo to store the information. From this project we access directly the database to get some basic information to be used on the crawl.

This projects does not modify any data on the database, only reads from it. To add data, it uses the API.

## Youtube API setup

In order to query youtube API, you need to get an API Key to call the api. You can follow the [documentation](https://developers.google.com/youtube/v3/getting-started) to configure your google account to use Youtube API

## API

_NOTE_ This project uses an API service to process the data. The API is not included on this repository.

The data retrieved from youtube is send to an API with some information to add the youtube video to the system.

## Usage

0. clone the repository
1. run `npm install`
2. create `.env` file and set the values. You can use the `.env.example`.
3. run `npm start`

## Logs

The projects stores the results on the folder __logs__ at the root of the project.

On every execution, and _executionID_ is created with a timestamp. This is used to create a subfolder to store the results of the execution.

It creates a file with the name __channelId.txt_ that contains the ids of the videos that are not stored on the database and are used to send the API.



## docker-compose

We have configured docker-compose to setup the local environment to run the crawl with access to different services:

### Browserless

We can use puppeter with [browserless](https://www.browserless.io/) in order to automate and run the test without having installed the chrome driver on our local machine. Usefull for remote executions.

The docker container of [browserless/chrome](https://github.com/browserless/chrome) allow us to run the execution inside the container, and also allows use to live debug on the browser.

### Mongo

We have access to a local instance of mongo on docker-compose, it will start and load some default data usefull for testing.

Also we have access to a mongo web interface to access the database using [mongo-express](https://github.com/mongo-express/mongo-express).

## References

- [browserless](https://www.browserless.io/)
- [browserless/chrome repository](https://github.com/browserless/chrome)
- [https://blog.logrocket.com/how-to-set-up-a-headless-chrome-node-js-server-in-docker/]
- [Docker mongo](https://hub.docker.com/_/mongo)
- [Docker mongo-express](https://hub.docker.com/_/mongo-express)
