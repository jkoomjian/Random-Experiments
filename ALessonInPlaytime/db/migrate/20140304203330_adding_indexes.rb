class AddingIndexes < ActiveRecord::Migration
  def up

    add_index "comments", ["commentable_id", "commentable_type"]
    add_index "comments", ["user_id"]
    add_index "comments", ["published"]

    add_index "honor_roll_posts", ["lesson_id"]
    add_index "honor_roll_posts", ["user_id"]
    add_index "honor_roll_posts", ["published"]
    add_index "honor_roll_posts", ["slug"]

    add_index "lessons", ["suggested_age_min"]
    add_index "lessons", ["suggested_age_max"]
    add_index "lessons", ["lesson_focus"]
    add_index "lessons", ["published"]
    add_index "lessons", ["slug"]
    add_index "lessons", ["category_id"]
    add_index "lessons", ["is_free"]

    add_index "printables", ["lesson_id"]
    add_index "printables", ["published"]

    add_index "users", ["email"]
    add_index "users", ["subscription_status"]
    add_index "users", ["trial_start"]
  end

  def down
  end
end
