class CreateSharedUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :shared_users do |t|
      t.references :short_link
      t.string :email
      t.timestamps
    end
  end
end
