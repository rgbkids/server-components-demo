```
git clone https://github.com/rgbkids/server-components-demo.git -b feature/vteacher-rsc-serverless-cms
```

DB

```
docker-compose up -d
```

# DB

install


```
#1回だけ
yum install postgresql-server postgresql-devel postgresql-contrib -y
```

```
psql -d vteachersapi -U vteachersadmin -h localhost -p 9999
```

```
\l
```

```
CREATE DATABASE vteachersapi;
CREATE ROLE vteachersadmin WITH LOGIN PASSWORD 'password';
ALTER ROLE vteachersadmin WITH SUPERUSER;
ALTER DATABASE vteachersapi OWNER TO vteachersadmin;
```
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
```
\dt;
```

relation “table” does not existの場合、下記をしてから再実行
# スキーマを削除
drop schema public cascade;
# スキーマを作成
create schema public;

```docker db volume
[root@ip-172-31-26-92 server-components-demo]# docker volume ls
DRIVER    VOLUME NAME
local     server-components-demo_db
local     server-components-demo_db-5432
[root@ip-172-31-26-92 server-components-demo]# 
[root@ip-172-31-26-92 server-components-demo]# docker volume inspect server-components-demo_db
[
    {
        "CreatedAt": "2021-08-26T02:17:47Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "server-components-demo",
            "com.docker.compose.version": "1.29.2",
            "com.docker.compose.volume": "db"
        },
        "Mountpoint": "/var/lib/docker/volumes/server-components-demo_db/_data",
        "Name": "server-components-demo_db",
        "Options": null,
        "Scope": "local"
    }
]
[root@ip-172-31-26-92 server-components-demo]# docker volume inspect server-components-demo_db-5432
[
    {
        "CreatedAt": "2021-08-26T02:16:40Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "server-components-demo",
            "com.docker.compose.version": "1.29.2",
            "com.docker.compose.volume": "db-5432"
        },
        "Mountpoint": "/var/lib/docker/volumes/server-components-demo_db-5432/_data",
        "Name": "server-components-demo_db-5432",
        "Options": null,
        "Scope": "local"
    }
]
```

App

```
npm i
```

```
npm run seed
```

```
npm start
```

常駐
```
npm start &
```
Control + C





http://localhost/


----
AWSで動かす

こちらを参考に必要なソフトをインストールしておく（ポートは全て空ける）
https://zenn.dev/rgbkids/articles/8025b3297e07d4

history

環境構築（AMIでとってある：REACT-SERVER-COMPONENTS-SERVERLESS_0_1_0）

```
    1  yum update -y
    2  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
    3  . ~/.nvm/nvm.sh
    4  nvm install node
    5  node -e "console.log('Running Node.js ' + process.version)"
    6  yum install git -y
    7  amazon-linux-extras install docker
    8  chkconfig docker on
    9  systemctl enable docker.service
   10  systemctl restart docker.service
   11  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   12  chmod +x /usr/local/bin/docker-compose
   13  ll
   14  cd ~
   15  ll
   16  git clone https://github.com/rgbkids/server-components-demo.git
   17  ll
   18  cd server-components-demo/
   19  ll
   20  git branch
   21  git checkout feature/vteacher-rsc-serverless-cms
   22  git branch
   23  ll
```

ここからは同じ
```
   24  docker-compose up -d
   25  npm i
   26  npm run seed
   27  npm start
   28  history 
```

URL
http://ec2-18-183-237-27.ap-northeast-1.compute.amazonaws.com/

FQDN指定しないとfetchで失敗するため
http://vteacher.cmsvr.live/




----

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
