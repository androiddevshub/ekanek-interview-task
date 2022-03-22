class CreateUserUploads < ActiveRecord::Migration[6.1]
  def change
    create_table :user_uploads do |t|
      t.references :user
      t.string :name
      t.string :description
      t.string :key
      t.string :url
      t.string :file_type
      t.timestamps
    end
  end
end
