
Rails.application.routes.draw do
  get 'post/new'

  get 'post/delete'

  get 'post/update'

  get 'posts/index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :posts
end
