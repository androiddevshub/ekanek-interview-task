class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :user_uploads       

  def user_data(token)
    {
      id: id,
      name: name,
      email: email,
      token: token,
    }
  end        
end
