class CreateUserTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :user_tokens do |t|
      t.string :access_token
      t.datetime :expires_at
      t.integer :user_id
      t.boolean :active
      t.timestamps
    end
    add_index :user_tokens, ["user_id"], name: "index_user_tokens_on_user_id", unique: false
    add_index :user_tokens, ["access_token"], name: "index_user_tokens_on_access_token", unique: true
  end
end
