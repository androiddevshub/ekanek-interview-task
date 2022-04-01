class UserUploads < Api

  namespace :user_uploads, desc: "Upload Related Operations" do

    desc "User uploads API"
    get "/:user_id" do
      user = User.find_by(id: params[:user_id])
      if user.user_uploads
        { status: true, data: user.user_uploads }
      else
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end

    desc "Generate pre signed url API"
    params do
      requires :fileName, type: String, desc: "File Name", documentation: { param_type: "body" }
      requires :fileType, type: String, desc: "File Type", documentation: { param_type: "body" }
      requires :directory, type: String, desc: "Directory", documentation: { param_type: "body" }
    end

    post "/generate_presigned_url" do
      filename = params[:fileName]
      file_type = params[:fileType]
      directory = params[:directory]
      key = "#{directory}/#{SecureRandom.hex}/#{filename}"
      
      signer = Aws::S3::Presigner.new
      post_url = signer.presigned_url(:put_object, bucket: ENV['AWS_BUCKET_NAME'], key: key, acl: 'public-read', content_type: file_type)
      get_url = "https://#{ENV['AWS_BUCKET_NAME']}.s3.us-east-2.amazonaws.com/#{key}"

      if post_url
        { status: true, data: { post_url: post_url, get_url: get_url, key: key}, message: "Link generated successfully" }
      else
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end

    desc "Save uploaded file API"
    params do
      requires :user_id, type: Integer, desc: "User Id", documentation: { param_type: "body" }
      requires :name, type: String, desc: "Name", documentation: { param_type: "body" }
      requires :description, type: String, desc: "Description", documentation: { param_type: "body" }
      requires :key, type: String, desc: "Key", documentation: { param_type: "body" }
      requires :url, type: String, desc: "Url", documentation: { param_type: "body" }
      requires :file_type, type: String, desc: "File Type", documentation: { param_type: "body" }
    end

    post "/" do
      user_upload = UserUpload.new(params)
      if user_upload.save!
        { status: true, data: user_upload, message: "File saved successfully" }
      else
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end

    delete "/:id" do
      upload = UserUpload.find_by(id: params[:id])
      client = Aws::S3::Client.new
      obj = client.delete_object({
        bucket: ENV['AWS_BUCKET_NAME'], 
        key: params[:key], 
      })
      if upload.delete && obj
        { status: true, message: "Object deleted successfully" }
      elsif 
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end

  end

end