# React Server Components Templates For Serverless

## 1. Download

http://vteacher.mszk.biz/

- docker-compose.yml
- credentials.js

## 2. Docker

You can also start dev build of the app by using docker-compose.

https://www.docker.com/

## 3. Setup

You will need to have nodejs >=14.9.0 in order to run this demo. [Node 14 LTS](https://nodejs.org/en/about/releases/) is a good choice!

  ```
  npm install
  ```

## 4. Run containers in the detached mode

  ```
  docker-compose up -d
  ```

## Option: Run seed script

  ```
  docker-compose exec vteachers-app-{your-port} npm run seed
  ```

You're done!

Then open http://localhost:{your-port}.

## License
This demo is MIT licensed.
