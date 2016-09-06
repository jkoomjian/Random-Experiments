class AddUserIdToComments < ActiveRecord::Migration
  def up
    add_content_column :comments, :user_id, :integer, index: true
  end

  def down
    remove_column :comments, :user_id
    remove_column :comments_versions, :user_id
  end
end