
# CMSをローカルで開発する

ローカル環境（localhost）で開発する場合は `/etc/hosts` に `127.0.0.1 vteacher.cmsvr.live` を追加すること。
本番環境を確認する場合は `#` でコメントアウトし、DNSキャッシュをクリアをすること。
ローカルで開発する場合は下記の「DBを起動」から行う。

```
sudo vi /etc/hosts
```

# CMSをサーバーにデプロイする

## 前準備（AWS）

- EC2
こちらを参考に必要なソフトをインストールしておく（ポートは全て空ける）
https://zenn.dev/rgbkids/articles/8025b3297e07d4

- AMI
環境構築用のイメージ（AMI：REACT-SERVER-COMPONENTS-SERVERLESS_0_1_0）

  - history

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
```

## インストール

- Gitからソースコートを取得

```
git clone https://github.com/rgbkids/server-components-demo.git -b feature/vteacher-rsc-serverless-cms
```

```
cd server-components-demo
```

- DBを起動

```
docker-compose up -d
```

- アプリケーションをインストール

```
npm i
```

- DBのマイグレーション

```
npm run seed
```

## 起動

- アプリケーションを起動

```
npm start
```

- 常駐させる場合

```
npm start &
```
※ [Ctrl] + [C] で抜ける


# CMSの確認

http://vteacher.cmsvr.live/


# Memo

- DBのデータを見る

```
# postgresql関連のインストール
yum install postgresql-server postgresql-devel postgresql-contrib -y
```

```
# DBに接続
psql -d vteachersapi -U vteachersadmin -h localhost -p 5433
```

- Docker: Imageの削除
  
```
# docker ps -a
# docker rm ${CONTAINER ID}
```

- Docker: Volumeの場所

```
# docker volume ls
# docker volume inspect ${VOLUME NAME}
# docker volume rm ${VOLUME NAME}
```

# License
This demo is MIT licensed.
