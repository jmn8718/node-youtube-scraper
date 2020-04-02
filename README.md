# node-youtube-scrapper

The goal of this project is to scrap youtube channel's page to get the latest video ids of a channel.

The [youtube API](https://developers.google.com/youtube/v3/docs) can be used to get the latest videos of a channel too.

## Requirements

- nodejs
- mongodb
- youtube API key
- API token

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

## TODO

- [x] remove duplicated before check on db
- [x] Handle errors when page take more than 10s to load
- [X] Query youtube API to get videos data
- [ ] Handle youtube error response
- [x] Handle crawl results
- [ ] Handle api error response
- [x] write results to file
- [ ] Generate report from execution
- [ ] Setup docker for DB and API for testing purposes