class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title
      t.string :location
      t.date :datetime
      t.decimal :price

      t.timestamps
    end
  end
end
