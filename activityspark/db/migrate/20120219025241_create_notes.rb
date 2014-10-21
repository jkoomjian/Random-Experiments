class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.integer :pledge_id
      t.integer :participant_id
      t.text :note

      t.timestamps
    end
  end
end
