Rails.application.routes.draw do
  # default_url_options :host => "http://localhost:3000"
  mount Api => "/"
  devise_for :users
  root to: 'welcome#index'
  get '/s/:slug', to: 'short_links#show', as: :short
  get "/*path", to: "welcome#index", constraints: ->(request) do
                  !request.xhr?
                end
end
