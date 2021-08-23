# React Server Components Templates For Serverless

## Download

http://vteacher.mszk.biz/

- docker-compose.yml
- credentials.js


## Setup

You will need to have nodejs >=14.9.0 in order to run this demo. [Node 14 LTS](https://nodejs.org/en/about/releases/) is a good choice!

  ```
  npm install
  ```

(Or `npm run start:prod` for a production build.)

## DB Setup with Docker

You can also start dev build of the app by using docker-compose.

https://www.docker.com/

### 1. Run containers in the detached mode

  ```
  docker-compose up -d
  ```

### 2. Run seed script

  ```
  docker-compose exec vteachers-app npm run seed
  ```

You're done!
Then open http://localhost:4000.

## License
This demo is MIT licensed.
