class CreateTags < ActiveRecord::Migration
  def self.up
    create_table :tags do |t|
    end
  end

  def self.down
    drop_table :tags
  end
end
