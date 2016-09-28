# 連載：WindowsユーザーのためのDockerコンテナ入門（Azure活用編）

# Dockerコンテナの活用　単一コンテナから複数コンテナ構成へ

>アバナード　旭 哲男  
>2016/mm/dd

前回は、Azureクラウド環境にDockerホストを作成し、WindowsからNginxのDockerコンテナを操作するところまでを解説した。

今回は、分散キーストアである```Apache CASSANDRA```のDockerコンテナをつかって、より実践的なDockerの使い方を解説する。

> Apache CASSANDRAは、Facebookで開発された、オープンソースのデータベース（分散型キーストア）である。
> 基本的にはKey-valueのペアを保管・保存するキーストアのシステムであるが、複数のノードにデータを複製する機構をもつことで
> データ量やアクセス数に応じてノードを追加拡張することで、性能を維持することが可能であり、
> ノードに障害が発生しても生き残っているノードがある限りデータの読み書きが可能といった、
> 障害に対して極めて強い耐性を持つデータベースである。
> No SQLの代表格といえるCASSANDRAだが、データを扱うための、CQL(Cassandra Query Language)という
> SQLライクな言語を提供し、一般的なRDBMSとほぼ同じ使い方ができるのも大きな魅力である。

本記事では、まずは単一のDockerホストにCASSANDRAのコンテナをロードし、別のコンテナからCASSANDRAを
使う手順を説明したのち、Azure Container Serviceを使った複数のDockerホスト上に
CASSANDRAのコンテナをロードする手順を説明する。

前回と同様に、本記事では複数のシェルを使い分ける。記事中以下の表記が出てきたときは、それぞれシェルを使い分けていることに注意。

| 記載例 | シェル | 起動方法 |
| --- | --- | --- |
| PS> | PowerShell | スタート→”PowerShell”を検索→アイコンを右クリックし「管理者として実行」 |
| CMD> | コマンドプロンプト | スタート→”CMD”を検索→クリック |
| SSH> | Putty SSHセッション | PowerShellまたはコマンドプロンプトから”putty”を入力して起動 |

------

## Cassandra Dockerコンテナをロードする

まずは、Dockerコンテナをロードする先のDockerホストを起動する。まだ、Dockerホストを作成していない場合は前回の
記事を参考にDockerホストを作成してほしい。

```CMD
# Azure-cli を ASMモードに設定する
CMD> azure config mode asm
# Azureにログインする
CMD> azure login
# Dockerホストを起動する
CMD> azure vm start "Dockerホスト名"
```

つぎに、Dockerホスト上にCASSANDRAコンテナを用意し、CASSANDRAコンテナをロードする。

```SSH
# CassandraコンテナのイメージをPULLする
SSH> docker pull Cassandra
# Cassandraを起動する
SSH> docker run -d --name some-cassandra cassandra
# Cassandraが起動したことを確認する
SSH> docker ps
```

![Docker run cassandra1](./docker-run-cassandra_1.PNG "Docker run cassandra1")


## DockerコンテナにDockerホストのストレージをマップする

## Dockerコンテナをコミットしタグをつける

## Azure Container ServiceによるDocker swarm環境の構築

## Swarm環境にCassandraコンテナをロードする


