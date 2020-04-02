# node-youtube-scrapper

The goal of this project is to scrap youtube channel's page to get the latest video ids of a channel.

The [youtube API](https://developers.google.com/youtube/v3/docs) can be used to get the latest videos of a channel too.

## Requirements

- nodejs
- mongodb

## Usage

0. clone the repository
1. run `npm install`
2. create `.env` file and set the values. You can use the `.env.example`.
3. run `npm start`

## TODO

- [x] remove duplicated before check on db
- [ ] Handle errors when page take more than 10s to load
- [ ] Query youtube API to get videos data
- [ ] Handle crawl results
- [x] write results to file