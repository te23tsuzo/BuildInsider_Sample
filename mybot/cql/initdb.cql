//サンプルスキーマの生成
CREATE KEYSPACE IF NOT EXISTS mykeyspace 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  
AND durable_writes = true;

//サンプルテーブルの生成
CREATE TABLE IF NOT EXISTS mykeyspace.posts 
( id text PRIMARY KEY, content text, created_at timestamp, tags set<text>, title text);

//タイトルで検索できるようにインデックスを追加
CREATE INDEX IF NOT EXISTS posts_title 
ON mykeyspace.posts (title);