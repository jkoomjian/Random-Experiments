class CreateParticipants < ActiveRecord::Migration
  def change
    create_table :participants do |t|
      t.string :first_name
      t.string :last_name
      t.string :email_addr
      t.integer :num_purchased
      t.integer :response_status
      t.string :street_addr
      t.string :city
      t.string :state
      t.string :zip
      t.string :cc
      t.string :expiration_dt
      t.string :phone
      t.integer :pledge_id

      t.timestamps
    end
  end
end
