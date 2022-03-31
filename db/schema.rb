# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_03_30_173126) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "shared_users", force: :cascade do |t|
    t.bigint "short_link_id"
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["short_link_id"], name: "index_shared_users_on_short_link_id"
  end

  create_table "short_links", force: :cascade do |t|
    t.string "url"
    t.string "slug"
    t.bigint "user_upload_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "access", null: false
    t.index ["user_upload_id"], name: "index_short_links_on_user_upload_id"
  end

  create_table "user_tokens", force: :cascade do |t|
    t.string "access_token"
    t.datetime "expires_at"
    t.integer "user_id"
    t.boolean "active"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["access_token"], name: "index_user_tokens_on_access_token", unique: true
    t.index ["user_id"], name: "index_user_tokens_on_user_id"
  end

  create_table "user_uploads", force: :cascade do |t|
    t.bigint "user_id"
    t.string "name"
    t.string "description"
    t.string "key"
    t.string "url"
    t.string "file_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_uploads_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", default: "", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
