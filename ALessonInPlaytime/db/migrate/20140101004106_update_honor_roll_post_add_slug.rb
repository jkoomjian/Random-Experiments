class UpdateHonorRollPostAddSlug < ActiveRecord::Migration
  def up
    add_content_column :honor_roll_posts, :slug, :string
  end

  def down
    remove_column :honor_roll_posts, :slug
    remove_column :honor_roll_posts_versions, :slug
  end
end