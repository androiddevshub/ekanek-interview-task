class ShortLink < ApplicationRecord
  validates_presence_of :url
  validates :url, format: URI::regexp(%w[http https])
  validates_uniqueness_of :slug
  validates_length_of :slug, within: 3..255, on: :create, message: "too long"
  belongs_to :user_upload
  has_many :shared_users

  # auto slug generation
  before_validation :generate_slug
  
  def generate_slug
    self.slug = SecureRandom.uuid[0..10] if self.slug.nil? || self.slug.empty?
    true
  end

  def short
    Rails.application.routes.url_helpers.short_url(slug: self.slug)
  end

  def data
    {
      id: id,
      short_url: self.short,
      access: access
    }
  end


  # def self.shorten(url, slug = '')
  #   link = ShortLink.where(url: url, slug: slug).first
  #   return link.short if link  
    
  #   link = ShortLink.new(url: url, slug: slug)
  #   return link.short if link.save
    
  #   ShortLink.shorten(url, slug + SecureRandom.uuid[0..10])
  # end
end
