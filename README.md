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

docker-compose exec vteachers-app-4001 npm run seed

## DB

  ```
  psql -d vteachersapi -U vteachersadmin -h localhost -p {your-db-port}
  ```

psql -d vteachersapi -U vteachersadmin -h localhost -p 5433
psql -d vteachersapi -U vteachersadmin -h vteacher.cmsvr.live -p 5433
psql -d vteachersapi -U vteachersadmin -h vteacher.cmsvr.live -p 5432

cd server-components-demo
docker-compose up -d
psql -d vteachersapi -U vteachersadmin -h localhost -p 5433


```
DROP TABLE IF EXISTS vteachers;
CREATE TABLE vteachers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);
```

CREATE TABLE vteachers (id SERIAL PRIMARY KEY, created_at TIMESTAMP NOT NULL, updated_at TIMESTAMP NOT NULL, title TEXT, body TEXT);

relation “table” does not existの場合、下記をしてから再実行
# スキーマを削除
drop schema public cascade;
# スキーマを作成
create schema public;



You're done!

Then open http://localhost:{your-port}.

http://localhost:4001


## License
This demo is MIT licensed.
