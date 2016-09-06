class UpdateLessonAddCategory < ActiveRecord::Migration
  def up
    add_content_column :lessons, :category_id, :integer
  end

  def down
    remove_column :lessons, :category_id
    remove_column :lesson_versions, :category_id
  end
end
