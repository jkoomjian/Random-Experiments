class UpdateUserAddStripeId < ActiveRecord::Migration
  def up
    add_column prefix(:users), :stripe_id, :string
  end

  def down
    remove_column prefix(:users), :stripe_id
  end
end