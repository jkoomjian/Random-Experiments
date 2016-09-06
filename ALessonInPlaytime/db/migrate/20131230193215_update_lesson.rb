class UpdateLesson < ActiveRecord::Migration
  def up
    add_content_column :lessons, :slug, :string
  end

  def down
    remove_column :lessons, :slug
    remove_column :lesson_versions, :slug
  end
end
