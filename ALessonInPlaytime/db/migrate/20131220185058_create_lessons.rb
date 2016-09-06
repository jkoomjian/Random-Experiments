class CreateLessons < ActiveRecord::Migration
  def change
    Cms::ContentType.create!(:name => "Lesson", :group_name => "A Lesson In Playtime")
    create_content_table :lessons, :prefix=>false do |t|
      t.string :name
      t.string :est_duration
      t.string :suggested_age_display
      t.integer :suggested_age_min
      t.integer :suggested_age_max
      t.integer :prep_time
      t.string :lesson_focus
      t.string :location
      t.string :num_children
      t.text :objective, :size => (64.kilobytes + 1)
      t.text :milestone, :size => (64.kilobytes + 1)
      t.text :materials, :size => (64.kilobytes + 1)
      t.text :lesson_prep, :size => (64.kilobytes + 1)
      t.text :lesson_plan, :size => (64.kilobytes + 1)
      t.text :video

      t.timestamps
    end
  end
end
