class Users < Api

  namespace :users, desc: "User Related Operations" do
    
    get "/" do
      { status: true, message: "API Called" }
    end
    
  end
end
