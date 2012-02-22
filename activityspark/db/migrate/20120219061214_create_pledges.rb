class CreatePledges < ActiveRecord::Migration
  def change
    create_table :pledges do |t|
      t.string :title
      t.integer :host_id
      t.decimal :total_price
      t.decimal :price_per_person
      t.integer :num_people_required
      t.integer :max_num_people
      t.date :time
      t.date :deal_deadline
      t.string :notes
      t.integer :curr_num_pledged
      t.integer :status
      t.string :location

      t.timestamps
    end
  end
end