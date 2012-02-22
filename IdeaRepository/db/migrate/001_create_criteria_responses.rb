class CreateCriteriaResponses < ActiveRecord::Migration
  def self.up
    create_table :criteria_responses do |t|
    end
  end

  def self.down
    drop_table :criteria_responses
  end
end
