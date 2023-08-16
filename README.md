# News API

This is the repo for my backend project - a fully hosted API with news articles, comments, users, topics - all linked through psql. To find a list of all available endpoints, send a GET request to `/api`.

The hosted version can be found here: [https://chris-d-backend-news-project.onrender.com](https://chris-d-backend-news-project.onrender.com)

## Requirements

- Node.js version 20.5.0 or later
- PostgreSQL version 14.8 or later

Note: earlier versions of Node.js and PostgreSQL may work but have not been tested.

## Installation

To run this on a local machine, you will need to first clone this repository onto a local machine. Then:
1. Run `npm install` to install all dependencies
2. Run `npm run setup-dbs` to setup the development and test databases.
3. Create `.env.test` and `.env.development` in the root folder. Inside each of these add `PGDATABASE=nc_news_test` and `PGDATABASE=nc_news` respectively
4. Run `npm run seed` to seed the development database (the test database is seeded when tests are run).

## Using the API

Run `npm t app` to test all the endpoints with data from the test database. Run `node listen.js` to host a local version, which by default is hosted on port 9090. This can then be queried in a program like Insomnia at [localhost:9090/api](localhost:9090/api).
