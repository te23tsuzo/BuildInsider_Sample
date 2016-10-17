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

DockerプロセスとしてCassandraが起動したことを確認したら、スキーマの準備とサンプルのテーブルを作成する。

今回は、クライアントとして```cqlsh```を使用する。
cqlshはCassandraの標準クライアントであり、Cassandraとの対話Shellの機能を提供する。（osqlのようなものと思ってもらえればよい。）
cqlshもDockerコンテナとして用意されており、いままでのDockerコンテナと同じようにDocker runコマンドを使い起動できる。

```SSH
# cqlshを起動し、Cassandraコンテナに接続する
SSH> docker run -it --link some-cassandra:cassandra --rm cassandra cqlsh cassandra
```

ここで使用したオプションは以下の通り。いずれもよく使うオプションでありこの後の説明でも登場するので覚えてほしい。
| オプション | 意味 | 説明 |
| --- | --- | --- |
| -it | 標準入力を受け入れる。 | cqlshのように、コンテナ起動後にユーザの何らかの入力を必要とする場合に指定する。 |
| --link | 接続先のコンテナ名を指定する。 | Dockerではコンテナ間通信をする場合、コンテナの名称を指定する必要がある。 |
| --rm | コンテナを起動するときに、既存のコンテナがあれば削除してから起動する。 | Dockerコンテナはコンテナを停止したときに、非活性なコンテナとして残存する(後述)。クライアントのコンテナの場合、何度も起動しなおすことになるためこのオプションを使用することをお勧めする。 |

Cassandraコンテナに接続できたら、```help```コマンドを実行しどのようなコマンドが使えるか確認することができる。

![Docker run cqlsh](./docker-run-cqlsh_1.PNG)

次にCQLを使い、キースペース（データベース）を作成し、テーブルを作成する。CQLの文法の説明についてはここでは割愛する。
CQLについては [The Cassandra Query Language (CQL)](https://cassandra.apache.org/doc/latest/cql/index.html)を参照のこと。

```CQL
# キースペースの作成
cqlsh> create keyspace mykeyspace with replication = {'class':'SimpleStrategy','replication_factor':1};
# キースペースに移動
cqlsh> use mykeyspace;
# テーブルの作成
cqlsh:mykeyspace> create table posts (
    id int primary key,
    title varchar,
    content text,
    created_at timestamp
);
# レコードの追加
cqlsh:mykeyspace> insert into posts (id,title, content, created_at) values (1, 'test', 'test entry.', dateof(now()));
# テーブルの参照
cqlsh:mykeyspace> select * from posts;
# cqlshの終了
cqlsh:mykeyspace> exit
```

Cassandraコンテナにテーブルを作成し、データを格納できたことを確認できたと思う。
ここでコンテナの関係を整理する。

![Docker struct cassandra cqlsh](./docker-struct-cassandra_cqlsh.PNG)

CassandraとCqlshは、Dockerホスト上で起動しているそれぞれ別のコンテナである。
Dockerコンテナ間の通信は、Dockerホスト内の仮想ネットワークで通信が行われる。
DockerコンテナはデフォルトではDockerホストの外から接続できないことに注意。
Dockerホストの外から接続する方法についてはｘｘで後述する。

## Dockerコンテナにストレージをマップする

先ほど起動した、Cassandraコンテナはストレージをマッピングしていない。
Dockerコンテナでの修正はDockerイメージに保存されるが、Dockerコンテナを削除すると
修正内容（今までの例ではキースペースの作成）が失われてしまう。

また、データが将来的に増大したときにリソースを確保でできるように
コンテナの外部リソースにデータを永続化（保存）したい。
いかに、ストレージをDockerコンテナに割り当てて起動する方法として
Dockerホストのストレージをマッピングする方法と、Azureストレージをマッピングする方法を説明する。

### DockerコンテナにDockerホストのストレージをマップする

ここでは、Dockerホストのストレージをマッピングして起動してみる。
ここではDockerホストのストレージをマッピングするため、すでに起動したCassandraコンテナを停止させ、
コンテナを一度削除してから、再度Cassandraコンテナを起動する。

```SSH
# Cassandraコンテナを停止する
SSH> docker stop some-cassandra
# Cassandraコンテナが停止されたことを確認する
SSH> docker ps -a
# Cassandraコンテナを削除する
SSH> docker rm some-cassandra
# Cassandraコンテナが削除されたことを確認する
SSH> docker ps -a
```

![Docker stop cassandra](./docker-stop-cassandra.PNG)

> Dockerコンテナを停止させると、STATUSが"EXIT"になるが、Dockerコンテナ自体は残ったままである。（上手の赤線部分）
> この状態で、同じ名前のコンテナを作成することはできない。
> Dockerコンテナを作成しなおすためには、Dockerコンテナを削除する必要がある。

次にDockerコンテナをDockerホストのストレージをコンテナから使用できるように、オプションを付与して起動する。

```SSH
# Cassandraに割り当てるディレクトリを用意する
SSH> cd /usr/local/lib
SSH> sudo mkdir cassandra
# ホストの/usr/local/lib/cassandraをコンテナ上の/var/lib/cassandraにマップして起動する
SSH> docker run -d --name some-cassandra -v /usr/local/lib/cassandra:/var/lib/cassandra cassandra
```

起動すると、Dockerホストの/usr/local/lib/cassandraにcassandraのデータファイルが生成される。
起動した直後は、データが一切ない状態だが、先に述べたテーブル生成からデータのインサートを実施すると
そこで登録したデータは、このデータファイルに保存されるようになる。
このデータファイルがあれば、Dockerのインスタンスを削除した後でも同じオプションを使うことで
データが保存された状態で起動しなおすことができる。

![Docker struct storage1](./docker-struct-cassandra-storage1.PNG)

> Dockerを停止し、再起動するだけなら Docker stopとDocker restartのコマンドを使うことで実現できる。
> この場合、コンテナは削除されていないため、停止した状態を保持した状態で起動される。
> データを保持するのであれば、ホスト側のストレージのマッピングは不要に思われるが、
> 実際には、システム開発の過程ではDockerコンテナのパラメータ修正しながら起動することが多く、
> コンテナを削除してから、起動しなおすことが必然として発生するためホスト側のストレージにデータを記録することが望ましい。

### DockerコンテナにAzureストレージをマップする

Dockerコンテナにストレージをマップするうえで、Dockerホストのストレージを用意する場合、
もともとの仮想マシンで用意されているストレージではなく、Azure Storageに新しくBlobコンテナから
ストレージを調達して仮想マシンに割り当て、Dockerコンテナに割り当てたいということがあるだろう。

データベースであれば、データ量の増加に伴いストレージをより簡単に増強したいという欲求があるだろうし、
クラウドだからこその利点(大容量、安価、複製が容易、…)があればなおさらである。

Azure Dockerホストでは、Azure Storage上にDockerボリュームを作成使用できるようにする
機能```azurefile-dockervolumedriver```が用意されており、Dockerコマンドから容易に
Dockerボリュームを構築できるようになっている。

> 通常LinuxでAzure Storegeを利用する場合、１．Blobの作成、２．仮想マシンへの割り当て、３．ストレージのマウントを
> それぞれ手作業で実施する必要があり、ある程度Linuxの管理に精通していないと、Dockerボリュームを作成するのは困難である。
> azurefile-dockervolumedriverを採用することで、それらの作業を一気に飛ばして、ボリュームを作成・利用できるようになる。
> 本記事の執筆時点では、docker-azuredriverはデフォルトではインストールされていないため手動でインストールする必要がある。

まずは、azurefile-dockervolumedriverをインストールする。

```SSH
# ドライバー及び、設定ファイルをコピーする
SSH> cd /var/tmp
SSH> wget https://github.com/Azure/azurefile-dockervolumedriver/releases/download/v0.5.1/azurefile-dockervolumedriver
SSH> wget https://raw.githubusercontent.com/Azure/azurefile-dockervolumedriver/master/contrib/init/upstart/azurefile-dockervolumedriver.conf
SSH> wget https://raw.githubusercontent.com/Azure/azurefile-dockervolumedriver/master/contrib/init/upstart/azurefile-dockervolumedriver.default
# ドライバーを実行権限を付与し、実行フォルダにコピーする
SSH> chmod +x azurefile-dockervolumedriver
SSH> sudo cp azurefile-dockervolumedriver /usr/bin
# 設定ファイルを構成フォルダにコピーする
SSH> sudo cp azurefile-dockervolumedriver.conf /ect/init
# Azure Storegaアカウント情報を設定する
SSH> sed s/youraccount/[Azure Storegeアカウント名]/ azurefile-dockervolumedriver.default > azurefile-dockervolumedriver.1
SSH> sed s/yourkey/[Azure Storageアカウントキー]/ azurefile-dockervolumedriver.1 > azurefile-dockervolumedriver.2
SSH> cp azurefile-dockervolumedriver.2 /etc/default/azurefile-dockervolumedriver
```

> Azure Storageアカウントを設定するときに、ここではsedを使ったが、任意のエディタでyouraccount,yourkey を修正してよい。

Azure Storageのアカウント名、アカウントキーは[Azureポータルサイト](http://portal.azure.com)にアクセスし、
次の順番で項目を選択する。
すべてのリソース→[ストレージアカウント名]をクリック→アクセスキー

![azure storage account](./azure-storage-account.PNG)

ファイルを配置したのち、ドライバーサービスを起動する。

```SSH
# 構成ファイルの再読み込み
SSH> sudo initctl reload-configuration
# ドライバーサービスの起動
SSH> sudo initctl start azurefile-dockervolumedriver
```

ドライバサービスが起動したら、Dockerボリュームを作成してみる。

```SSH
# Azure Storageを使ってDockerボリュームを作成する
SSH> docker volume create --name myvol -d azurefile -o share=myshare
# Docker Volumeの一覧を確認する
SSH> docker volume ls
```

![docker volume list](./docker-volume-ls.PNG)

AzurefileとしてDockerボリュームが生成されたことを確認できる。（赤枠内）
[Azureポータルサイト](http;//portal.azure.com)では、以下のように選択すると確認できる。
すべてのリソース→[ストレージアカウント名]をクリック→FILEサービス”ファイル”

![azure storege myshare](./azure-storage-myshare.PNG)

次に、今作成したボリュームをCassandraコンテナにマップし起動する。

```SSH
# Cassandraの停止と削除
SSH> docker stop some-cassandra & docker rm some-cassandra
# Azure StorageのDocker Volumeを使用してCassandraを起動する
SSH> docker run -d --name some-cassandra -v myvol:/var/lib/cassandra cassandra
```

Cassandraコンテナが起動されれると、myshare内にデータディレクトリが構成される。
先ほど確認した、ファイル共有"myshare"をクリックすると、ディレクトリが構成されていることを確認できる。

![azure storage myshare dirs](./azure-storage-myshare-dirs.PNG)

コンテナとストレージの関係は以下の通り。

![Docker struct storage2](./docker-struct-cassandra-storage2.PNG)

## 複数コンテナをロードする

次に、Cassandraコンテナを同一の仮想マシン内で起動し、簡易的なCassandraクラスタを構成する。
Cassandraコンテナをロードする前に、Cassandraコンテナを複数ロードできるように仮想メモリを拡張する。

> 本記事では、Dockerホスト作成時のデフォルトサイズである”Standard A1(1コア、1.75GBメモリ)”の仮想マシンを使用しており、
> 複数のCassandraコンテナをロードするために必要なメモリを持たないため、仮想メモリの拡張で複数コンテナのロードを可能にしている。
> 実際の運用では、あらかじめデータベースの必要とするメモリサイズを見積もり、仮想マシンのサイズ（スペック）を変更する手順となる。
> 本記事では、Dockerホストのサイズの見積もりについては言及しない。

```SSH
# 仮想メモリのスワップ領域（3GB）の作成
SSH> sudo dd if=/dev/zero of=/mnt/swap bs=50MB count=60
# 仮想メモリのセットアップ
SSH> sudo mkswap /mnt/swap
# スワップファイルの有効化
SSH> sudo swapon /mnt/swap
# 利用可能なメモリサイズの確認
SSH> free
```

つぎに、Cassandraコンテナを起動する。
事前に今まで起動していたCassandraコンテナを停止＆削除してから、以下の作業を実施すること。

```SSH
# Cassandra Node1のロード
SSH> docker run -d --name cassandra-nd1 -v myvol:/var/lib/cassandra -m 1G cassandra
# Cassandra Node2のロード
SSH> docker run -d --name cassandra-nd2 --link cassandra-nd1:cassandra -m 1G cassandra
# Cassandra Node2に接続
SSH> docker run -it --link cassandra-nd2:cassandra --rm cassandra cqlsh cassandra
# mykeyspace.postsを参照
cqlsh>select * from mykeyspace.posts;
```

ここでは、Node1にmyvolをマップして起動し、Node2はNode1のクラスタとして参加するようにコンテナを起動した。
Node2はストレージをマップしていないが、Node2に接続してもデータを参照できることを確認できたと思う。

![cassandra cluster 1](./cassandra-cluster1.PNG)

> ここではNode1, Node2が同期することを示すために、Node2ではあえてストレージをマップせずに起動した。
> 実際には、同期された後のデータを格納すべきストレージをマップすることが望ましい。

各コンテナ構成は以下の通り。

![cassandra struct cluster1](./docker-struct-cassandra-cluster1.PNG)

## Azure Container ServiceによるDocker swarm環境の構築



## Swarm環境にCassandraコンテナをロードする


