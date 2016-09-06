class CreatePrintables < ActiveRecord::Migration
  def change
    Cms::ContentType.create!(:name => "Printable", :group_name => "A Lesson In Playtime")
    create_content_table :printables, :prefix=>false do |t|
      t.string :name
      

      t.timestamps
    end
  end
end
