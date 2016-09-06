# This migration comes from bcms_blog (originally 20090415000003)
class AddAttachmentToBlogPosts < ActiveRecord::Migration
  def self.up
    change_table :blog_posts do |t|
      t.belongs_to :attachment
      t.integer :attachment_version
    end
    change_table :blog_post_versions do |t|
      t.belongs_to :attachment
      t.integer :attachment_version
    end
  end

  def self.down
    change_table :blog_posts do |t|
      t.remove :attachment
      t.remove :attachment_version
    end
    change_table :blog_post_versions do |t|
      t.remove :attachment
      t.remove :attachment_version
    end
  end
end
