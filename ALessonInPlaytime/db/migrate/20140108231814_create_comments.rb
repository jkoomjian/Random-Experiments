class CreateComments < ActiveRecord::Migration
  def change
    Cms::ContentType.create!(:name => "Comment", :group_name => "A Lesson In Playtime")
    create_content_table :comments, :prefix=>false do |t|
      t.integer :commentable_id
      t.string :commentable_type
      t.string :author
      t.string :email
      t.string :url
      t.string :ip
      t.text :body

      t.timestamps
    end
  end
end
