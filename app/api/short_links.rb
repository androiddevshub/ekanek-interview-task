class ShortLinks < Api

  namespace :short_links, desc: "Short links Related Operations" do

    desc "Create Short Link API"
    get "/:user_upload_id" do
      short_link = ShortLink.find_by(user_upload_id: params[:user_upload_id])
      if short_link
        { status: true, data: {short_link: short_link.data, shared_users: short_link.shared_users} }
      else
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end

    desc "Create Short Link API"
    post "/generate" do
      short_link = ShortLink.create(params)
      if short_link
        { status: true, data: short_link.data, message: "Short link generated successfully" }
      else
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end

    desc "Update access of short link"
    put "/:user_upload_id" do
      short_link = ShortLink.find_by(user_upload_id: params[:user_upload_id])
      if short_link.update(access: params[:access])
        params[:emails].map { |email| short_link.shared_users.find_or_create_by(email: email)} if short_link.access === "private"
        { status: true, data: short_link.shared_users, message: "Short link updated successfully" }
      else
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end
    

  end
end