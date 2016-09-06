class UpdateLessonsAddSummary < ActiveRecord::Migration
  def up
    add_content_column :lessons, :summary, :text
  end

  def down
    remove_column :lessons, :summary
    remove_column :lesson_versions, :summary
  end
end