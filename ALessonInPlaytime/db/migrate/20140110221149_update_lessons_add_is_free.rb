class UpdateLessonsAddIsFree < ActiveRecord::Migration
  def up
    add_content_column :lessons, :is_free, :boolean
  end

  def down
    remove_column :lessons, :is_free
    remove_column :lesson_versions, :is_free
  end
end
