class CreatePosts < CassandraMigrations::Migration
  def up
    create_table :posts,
		partition_keys: [:id, :created_month],
		primary_keys: [:created_at] do |t|
	t.integer 	:id
	t.string	:created_month
	t.timestamp	:created_at
	t.string	:title
	t.string	:category
	t.set		:tags, type: :float
	t.map		:my_map, key_type: :uuid, value_type: :float
	t.text		:content
	end
    create_index :posts, :category, name: 'posts_by_category'
  end
  
  def down
    drop_index 'posts_by_category'
    drop_table :posts
  end
end
