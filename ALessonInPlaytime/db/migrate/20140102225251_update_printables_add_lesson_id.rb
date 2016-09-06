class UpdatePrintablesAddLessonId < ActiveRecord::Migration
  def up
    drop_table :lessons_printables
    add_content_column :printables, :lesson_id, :integer, index: true
  end

  def down
    remove_column :printables, :lesson_id
    remove_column :printables_versions, :lesson_id
  end
end
