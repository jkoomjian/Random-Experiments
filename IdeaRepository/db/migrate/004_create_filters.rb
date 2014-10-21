class CreateFilters < ActiveRecord::Migration
  def self.up
    create_table :filters do |t|
    end
  end

  def self.down
    drop_table :filters
  end
end
