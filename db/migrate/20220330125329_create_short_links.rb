class CreateShortLinks < ActiveRecord::Migration[6.1]
  def change
    create_table :short_links do |t|
      t.string :url
      t.string :slug
      t.references :user_upload
      t.timestamps null: false
      t.string :access, null: false
    end
  end
end
