# This migration comes from bcms_blog (originally 20100521042244)
class AddModerateCommentsToBlog < ActiveRecord::Migration
  def self.up
    add_content_column :blogs, :moderate_comments, :boolean, :default => true
  end

  def self.down
    remove_column :blogs, :moderate_comments
    remove_column :blog_versions, :moderate_comments
  end
end
