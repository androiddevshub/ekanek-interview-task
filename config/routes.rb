Rails.application.routes.draw do
  mount Api => "/"
  devise_for :users
  root to: 'welcome#index'
  get "/*path", to: "welcome#index", constraints: ->(request) do
                  !request.xhr?
                end
end
