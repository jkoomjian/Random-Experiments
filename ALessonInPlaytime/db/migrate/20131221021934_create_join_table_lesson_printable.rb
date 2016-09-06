class CreateJoinTableLessonPrintable < ActiveRecord::Migration
  def change
	create_table :lessons_printables, :id => false do |t|
	  t.references :lesson, :null => false
	  t.references :printable, :null => false
	end

	# Adding the index can massively speed up join tables. Don't use the
	# unique if you allow duplicates.
	add_index(:lessons_printables, [:lesson_id, :printable_id])
  end
end