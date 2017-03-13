# BuildInsider_Sample

for Build Insider articles Sample Project.

以下の連載で使用した、サンプルが含まれています。
[WindowsユーザーのためのDockerコンテナー入門【Azure活用編】](http://www.buildinsider.net/enterprise/dockerazure)
詳細は、各フォルダのREADME.mdを参照してください。

# 前提条件

このサンプルアプリケーションはDocker環境で動作させることを想定しています。
筆者は、Microsoft AzureのDocker VMおよび、Azure Container Serivceで動作確認をしています。 

Twitterとの連動を可能とするため、Twitterの開発者アカウントの準備をお願いします。
[Welcome — Twitter Developers](https://dev.twitter.com/)

# 使用法

使用に当たっては、以下の準備をお願いします。

## 1. ソースの取得

 > git clone https://github.com/te23tsuzo/BuildInsider_Sample.git

## 2. mybot/config/default.jonの修正

twitter の開発者サイトから、[My apps](https://apps.twitter.com/)に行きKeyとAccessTokenを取得し、
mybot/config/default.jsの以下の該当部分(set your ...)を修正してください。

```(default.json)
"twitter": {
        "consumerKey": "set your consumerKey",
        "consumerSecret": "set your consumerrSecret",
        "accessToken": "set your accessToken",
        "accessTokenSecret": "set your accessTokenSecret",
        "callBackUrl": ""
    }
``` 

## 3. Dockerイメージを作成してください

mybot/Dockerfileと、web1/Dockerfileを用いて、Dockerイメージを作成してください。
詳細については、[Build Insider記事]()を参照してください。

## 4. Dockerコンテナを起動します

データベース、ボット、Webアプリの順で起動します。

### 4.1 データベースの起動

データベースとしてCassandraコンテナを起動します。

> Docker run --name some-cassandra -d cassandra

### 4.2 ボットアプリの起動

ボットアプリには以下のタスクを設定しています。順番にタスクを実行してください。

1. initdb データベースの初期化

  Cassandraのkeyspaceとテーブルを定義します。

  > doceker run mybot gulp initdb

2. tweetの収集とデータの格納

  TwitterのSearchAPIを使い、ツィートを収集しCassandraに格納します。

  > docker run --it mybot gulp collectweet

3. データアクセスREST Webサービスの起動

  Cassandraに格納したデータを取得するためのREST Webサービスを起動します。
  
  > docker run --it mybot

### 4.3 Webアプリの起動

  収集したツィートを参照するためのWebアプリを起動します。

  > docker run --it myweb

#　その他

Docker紹介を主眼としたサンプルアプリです。
データ収集のツールとして十分に検証したわけではありません。ご了承を。


