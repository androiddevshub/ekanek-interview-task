class Users < Api

  namespace :users, desc: "User Related Operations" do
    
    get "/" do
      { status: true, message: "API Called" }
    end

    desc "User registration API"
    params do
      requires :name, type: String, desc: "Name", documentation: { param_type: "body" }
      requires :email, type: String, desc: "Email Address", documentation: { param_type: "body" }
      requires :password, type: String, desc: "Password", documentation: { param_type: "body" }
    end

    post "/" do
      user = User.find_by(email: params[:email])
      if !user.present?
        user = User.new(params)
        if user.save!
          { status: true, data: user.as_json(except: [:created_at, :updated_at]), message: "Registration successful" }
        else
          error!({ status: false, message: user.errors.full_messages.join(", ") }, 400)
        end
      else
        error!({ status: false, message: "User already existed" }, 400)
      end
    end

    desc "User login API"
    params do
      requires :email, type: String, desc: "Email Address", documentation: { param_type: "body" }
      requires :password, type: String, desc: "Password", documentation: { param_type: "body" }
    end

    post "/login" do
      user = User.find_by(email: params[:email])
      if user.present?
        if user.valid_password?(params[:password])
          key = UserToken.create(user_id: user.id)
          { status: true, data: user.user_data(key.access_token), message: "Login successful" }
        else
          error!({ status: false, message: "Email and password do not match" }, 400)
        end
      else
        error!({ status: false, message: "User doesn't exist" }, 400)
      end
    end

    get "/dashboard" do
      authenticate!
      { status: true, message: "Authentication passed in dashboard", user: current_user }
    end

  end
end
