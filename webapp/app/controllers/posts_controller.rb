class PostsController < ApplicationController
  def index
    @posts = CassandraMigrations::Cassandra.select(:posts)
  end
end
