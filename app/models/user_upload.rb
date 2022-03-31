class UserUpload < ApplicationRecord
  belongs_to :user
  has_one :short_link
end
