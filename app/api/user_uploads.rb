class UserUploads < Api

  namespace :user_uploads, desc: "Upload Related Operations" do

    desc "User upload file API"
    params do
      requires :fileName, type: String, desc: "File Name", documentation: { param_type: "body" }
      requires :fileType, type: String, desc: "File Type", documentation: { param_type: "body" }
      requires :directory, type: String, desc: "Directory", documentation: { param_type: "body" }
    end

    post "/file" do

      filename = params[:fileName]
      file_type = params[:fileType]
      directory = params[:directory]
      key = "#{directory}/#{filename}"
      
      signer = Aws::S3::Presigner.new
      post_url = signer.presigned_url(:put_object, bucket: "interview-task-bucket", key: key, acl: 'public-read', content_type: file_type)
      get_url = "https://interview-task-bucket.s3.us-east-2.amazonaws.com/#{key}"
    
      user = User.find_by(email: params[:email])
      if post_url
        { status: true, data: { post_url: post_url, get_url: get_url }, message: "Link generated successfully" }
      else
        error!({ status: false, message: "Something went wrong" }, 400)
      end
    end
  end
end