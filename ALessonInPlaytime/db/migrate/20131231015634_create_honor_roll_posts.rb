class CreateHonorRollPosts < ActiveRecord::Migration
  def change
    Cms::ContentType.create!(:name => "HonorRollPost", :group_name => "A Lesson In Playtime")
    create_content_table :honor_roll_posts, :prefix=>false do |t|
      t.string :name
      t.belongs_to :lesson, :null => false
      t.belongs_to :user, :null => false
      t.string :blog_url
      t.text :question_enrichment, :size => (64.kilobytes + 1)
      t.text :question_material, :size => (64.kilobytes + 1)
      t.text :question_content, :size => (64.kilobytes + 1)
      t.text :question_testing, :size => (64.kilobytes + 1)
      t.text :teachers_lounge, :size => (64.kilobytes + 1)

      t.timestamps
    end
  end
end
