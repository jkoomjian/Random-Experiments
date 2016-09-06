class CreateBadges < ActiveRecord::Migration
  def change
    Cms::ContentType.create!(:name => "Badge", :group_name => "A Lesson In Playtime")
    create_content_table :badges, :prefix=>false do |t|
      t.string :lesson_focus
      

      t.timestamps
    end
  end
end
