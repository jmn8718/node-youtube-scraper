# node-youtube-scrapper

The goal of this project is to scrap youtube channel's page to get the latest video ids of a channel.

The [youtube API](https://developers.google.com/youtube/v3/docs) can be used to get the latest videos of a channel too.

## Requirements

- nodejs
- mongodb
- youtube API key

## Youtube API setup

In order to query youtube API, you need to get an API Key to call the api. You can follow the [documentation](https://developers.google.com/youtube/v3/getting-started) to configure your google account to use Youtube API

## Usage

0. clone the repository
1. run `npm install`
2. create `.env` file and set the values. You can use the `.env.example`.
3. run `npm start`

## TODO

- [x] remove duplicated before check on db
- [x] Handle errors when page take more than 10s to load
- [X] Query youtube API to get videos data
- [ ] Handle youtube error response
- [ ] Handle crawl results
- [x] write results to file